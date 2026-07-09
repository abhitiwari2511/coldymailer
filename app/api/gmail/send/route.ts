import { NextRequest } from "next/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"
import { consumeCredit, InsufficientCreditsError } from "@/lib/credits"
import MailComposer from "nodemailer/lib/mail-composer"

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

/**
 * Use nodemailer's MailComposer to build a RFC 2822 compliant
 * MIME message, then encode it for the Gmail API.
 */
async function buildRawEmail(opts: {
  from: string
  to: string
  subject: string
  text: string
  attachments?: { filename: string; content: Buffer; contentType: string }[]
}): Promise<string> {
  const mail = new MailComposer({
    from:        opts.from,
    to:          opts.to,
    subject:     opts.subject,
    text:        opts.text,
    attachments: opts.attachments,
  })

  const message = await mail.compile().build()

  // Gmail API expects base64url encoding
  return message
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch a PDF from a URL and return it as a Buffer
 */
async function fetchPdfBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch PDF: ${res.status} ${res.statusText}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
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

    // Get campaign + pending recipients + user resume info
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
        user: {
          select: {
            resumeUrl: true,
            name:      true,
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

    // Check and consume 1 credit before sending
    try {
      await consumeCredit(session.user.id, 1, "send_campaign")
    } catch (creditErr) {
      if (creditErr instanceof InsufficientCreditsError) {
        return Response.json(
          {
            error: "Insufficient credits",
            message: "You don't have enough credits to send emails. Please buy more credits.",
            creditsAvailable: creditErr.available,
            creditsRequired: creditErr.required,
          },
          { status: 402 },
        )
      }
      throw creditErr
    }

    // If campaign has attachResume, fetch the PDF once for all recipients
    let pdfAttachment: { filename: string; content: Buffer; contentType: string } | null = null

    if (campaign.attachResume && campaign.user.resumeUrl) {
      try {
        const pdfBuffer = await fetchPdfBuffer(campaign.user.resumeUrl)

        // Derive a clean filename from the user's name
        const nameSlug = (campaign.user.name ?? "resume")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "")

        pdfAttachment = {
          filename:    `${nameSlug}_resume.pdf`,
          content:     pdfBuffer,
          contentType: "application/pdf",
        }
      } catch (fetchErr) {
        console.error("Failed to fetch resume PDF for attachment:", fetchErr)
        return Response.json(
          { error: "Failed to fetch resume PDF for attachment" },
          { status: 500 }
        )
      }
    }

    const gmail = createGmailClient(account.access_token, account.refresh_token)

    const results = []

    // Sending one by one with delay to avoid getting as spam
    for (const recipient of campaign.recipients) {
      try {
        const raw = await buildRawEmail({
          from:    session.user.email!,
          to:      recipient.email,
          subject: campaign.subject,
          text:    recipient.generatedContent!,
          attachments: pdfAttachment ? [pdfAttachment] : undefined,
        })

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