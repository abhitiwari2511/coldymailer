import { NextRequest } from "next/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireSession()
  if (error) return error

  const { id } = await params

  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      userId: session.user.id, // this makes sure the user is the owner of the campaign
    },
    include: { recipients: true },
  })

  if (!campaign) {
    return Response.json({ error: "Campaign not found" }, { status: 404 })
  }

  return Response.json({ campaign })
}