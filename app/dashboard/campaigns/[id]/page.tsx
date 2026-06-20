import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, Reply, Eye } from "lucide-react"

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  const { id }  = await params

  const campaign = await prisma.campaign.findFirst({
    where:   { id, userId: session!.user.id },
    include: { recipients: true },
  })

  if (!campaign) notFound()

  const sent    = campaign.recipients.filter((r) => r.status === "sent").length
  const failed  = campaign.recipients.filter((r) => r.status === "failed").length
  const pending = campaign.recipients.filter((r) => r.status === "pending").length

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to campaigns
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{campaign.subject}</h1>
            <p className="text-sm text-white/50 mt-1 max-w-xl">{campaign.context}</p>
            <div className="flex items-center gap-3 mt-3 text-sm text-white/50">
              <span className="text-xs text-white/40">
                Created {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",   value: campaign.recipients.length, icon: Users,         color: "text-brand"       },
          { label: "Sent",    value: sent,                       icon: Eye,           color: "text-[#A4F4FD]"  },
          { label: "Failed",  value: failed,                     icon: Reply,         color: "text-red-400"     },
          { label: "Pending", value: pending,                    icon: Users,         color: "text-yellow-400"  },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-3xl font-semibold mb-1">{stat.value}</div>
            <div className="text-xs text-white/50">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recipients table */}
      <h2 className="text-base font-semibold mb-4">Recipients</h2>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/50 bg-white/[0.02]">
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Sent at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {campaign.recipients.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium">{r.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                    r.status === "sent"    ? "bg-brand/10 text-brand"           :
                    r.status === "failed"  ? "bg-red-500/10 text-red-400"       :
                                             "bg-white/10 text-white/60"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-white/40 text-xs">
                  {r.sentAt ? new Date(r.sentAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generated email preview for first recipient */}
      {campaign.recipients[0]?.generatedContent && (
        <>
          <h2 className="text-base font-semibold mb-4">Email Preview</h2>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 text-sm text-white/80 whitespace-pre-wrap leading-relaxed max-w-2xl">
            {campaign.recipients[0].generatedContent}
          </div>
        </>
      )}
    </div>
  )
}