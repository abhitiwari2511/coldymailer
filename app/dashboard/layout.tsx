import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import VideoBackground from "@/components/layout/appBackground"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
    
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden relative">
      <VideoBackground />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 overflow-hidden">
        {children}
      </main>
    </div>
  )
}