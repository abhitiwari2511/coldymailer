import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SettingsClient } from "@/components/dashboard/settingsClient"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where:  { id: session!.user.id },
    select: { resumeUrl: true, name: true, email: true, image: true },
  })

  return <SettingsClient user={user!} />
}