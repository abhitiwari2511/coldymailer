import { NextRequest } from "next/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import pdf from "pdf-parse/index.js"

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession()
  if (error) return error

  try {
    const { resumeUrl } = await req.json()

    if (!resumeUrl) {
      return Response.json({ error: "resumeUrl is required" }, { status: 400 })
    }

    const response = await fetch(resumeUrl)
    const buffer   = Buffer.from(await response.arrayBuffer())
    const parsed   = await pdf(buffer)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        resumeUrl,
        resumeText: parsed.text,
      },
    })

    return Response.json({ message: "Resume saved", resumeUrl })

  } catch (err) {
    console.error("Resume parse error:", err)
    return Response.json({ error: "Failed to process resume" }, { status: 500 })
  }
}

export async function GET() {
  const { session, error } = await requireSession()
  if (error) return error

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { resumeUrl: true },
  })

  return Response.json({ resumeUrl: user?.resumeUrl ?? null })
}