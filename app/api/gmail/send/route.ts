import { NextRequest } from "next/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"

function createGmailClient(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
  )

  oauth2Client.setCredentials({
    access_token:  accessToken,
    refresh_token: refreshToken,
  })

  return google.gmail({ version: "v1", auth: oauth2Client })
}

function buildEmailRaw(to: string, subject: string, body: string, from: string): string {
  const email = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\n")

  // Gmail API requires base64url encoding
  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession()
  if (error) return error

  try {
    const { campaignId } = await req.json()

    if (!campaignId) {
      return Response.json({ error: "campaignId is required" }, { status: 400 })
    }

    // Get tokens from DB
    const account = await prisma.account.findFirst({
      where: {
        userId:   session.user.id,
        provider: "google",
      },
      select: {
        access_token:  true,
        refresh_token: true,
      },
    })

    if (!account?.access_token || !account?.refresh_token) {
      return Response.json(
        { error: "Gmail not connected. Please sign in again." },
        { status: 401 }
      )
    }

    // Get campaign + pending recipients
    const campaign = await prisma.campaign.findFirst({
      where: {
        id:     campaignId,
        userId: session.user.id,
      },
      include: {
        recipients: {
          where: {
            status:           "pending",
            generatedContent: { not: null },
          },
        },
      },
    })

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (!campaign.recipients.length) {
      return Response.json(
        { error: "No pending recipients with generated emails" },
        { status: 400 }
      )
    }

    const gmail = createGmailClient(account.access_token, account.refresh_token)

    const results = []

    // Sending one by one with delay to avoid getting as spam
    for (const recipient of campaign.recipients) {
      try {
        const raw = buildEmailRaw(
          recipient.email,
          campaign.subject,
          recipient.generatedContent!,
          session.user.email!,
        )

        await gmail.users.messages.send({
          userId:      "me",
          requestBody: { raw },
        })

        // Update status to sent
        await prisma.recipient.update({
          where: { id: recipient.id },
          data:  {
            status: "sent",
            sentAt: new Date(),
          },
        })

        results.push({ email: recipient.email, status: "sent" })

      } catch (sendErr) {
        console.error(`Failed to send to ${recipient.email}:`, sendErr)

        // Update status to failed
        await prisma.recipient.update({
          where: { id: recipient.id },
          data:  { status: "failed" },
        })

        results.push({ email: recipient.email, status: "failed" })
      }

      // Wait 2 seconds between each email
      await sleep(2000)
    }

    return Response.json({ results })

  } catch (err) {
    console.error("Gmail send error:", err)
    return Response.json({ error: "Failed to send emails" }, { status: 500 })
  }
}