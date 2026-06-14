import { NextRequest } from "next/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

// creating a new campaign by user
export async function POST(req: NextRequest) {
  const { session, error } = await requireSession()
  if (error) return error

  try {
    const body = await req.json()
    const { subject, context, recipients } = body

    // inputs validation
    if (!subject || !context || !recipients?.length) {
      return Response.json(
        { error: "subject, context and recipients are required" },
        { status: 400 }
      )
    }

    // Check user has a resume
    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { resumeText: true },
    })

    if (!user?.resumeText) {
      return Response.json(
        { error: "Please upload your resume first" },
        { status: 400 }
      )
    }

    // Create campaign + recipients in one transaction
    const campaign = await prisma.campaign.create({
      data: {
        userId:  session.user.id,
        subject,
        context,
        recipients: {
          create: recipients.map((email: string) => ({
            email:  email.trim().toLowerCase(),
            status: "pending",
          })),
        },
      },
      include: {
        recipients: true,
      },
    })

    return Response.json({ campaign }, { status: 201 })

  } catch (err) {
    console.error("Campaign create error:", err)
    return Response.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}

//list all campaigns for current user
export async function GET() {
  const { session, error } = await requireSession()
  if (error) return error

  const campaigns = await prisma.campaign.findMany({
    where:   { userId: session.user.id },
    include: {
      recipients: {
        select: {
          id:     true,
          email:  true,
          status: true,
          sentAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ campaigns })
}