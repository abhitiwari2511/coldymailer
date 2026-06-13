
import { redirect } from "next/navigation"
import { requireSession } from "@/lib/session"

export default async function DashboardPage() {
  const { session } = await requireSession();

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome {session.user.name}</p>
      <p className="text-sm text-gray-400 mt-1">{session.user.email}</p>
    </div>
  )
}