import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import VideoBackground from "@/components/layout/appBackground"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { resumeUrl: true },
  })

  const hasResume = !!user?.resumeUrl

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden relative">
      <VideoBackground />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 overflow-hidden">
        {!hasResume && (
          <div className="bg-brand/10 border-b border-brand/20 px-6 py-3 flex items-center justify-between shrink-0">
            <p className="text-sm text-brand font-medium">
              ⚡ Upload your resume to start generating personalized emails
            </p>
            <Link
              href="/dashboard/settings"
              className="text-xs bg-brand text-white px-3 py-1.5 rounded-lg hover:bg-brand/90 transition-colors font-medium"
            >
              Upload now →
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}