import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Megaphone, Plus } from "lucide-react"

export default async function CampaignsPage() {
  const session  = await getServerSession(authOptions)
  const campaigns = await prisma.campaign.findMany({
    where:   { userId: session!.user.id },
    include: { recipients: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-white/50 mt-1">Manage your outreach campaigns.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Link>
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        {campaigns.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-white font-medium mb-1">No campaigns yet</h3>
            <p className="text-sm text-white/50 max-w-sm mb-6">
              Create your first campaign to start reaching out to recruiters automatically.
            </p>
            <Link
              href="/dashboard/campaigns/new"
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-white/50 bg-white/[0.02]">
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Recipients</th>
                  <th className="px-6 py-4 font-medium">Sent</th>
                  <th className="px-6 py-4 font-medium">Failed</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map((camp) => {
                  const sent    = camp.recipients.filter((r) => r.status === "sent").length
                  const failed  = camp.recipients.filter((r) => r.status === "failed").length
                  const pending = camp.recipients.filter((r) => r.status === "pending").length
                  const status  = sent > 0 ? "Sent" : pending > 0 ? "Pending" : "Draft"

                  return (
                    <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/campaigns/${camp.id}`}
                          className="font-medium hover:text-brand transition-colors block"
                        >
                          {camp.subject}
                        </Link>
                        <div className="text-xs text-white/40 mt-1 truncate max-w-xs">
                          {camp.context}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          status === "Sent"    ? "bg-brand/10 text-brand"           :
                          status === "Pending" ? "bg-yellow-500/10 text-yellow-400" :
                                                 "bg-white/10 text-white/60"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{camp.recipients.length}</td>
                      <td className="px-6 py-4">{sent}</td>
                      <td className="px-6 py-4 text-red-400">{failed || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/campaigns/${camp.id}`}
                          className="text-brand hover:underline font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}