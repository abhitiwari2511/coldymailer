import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Megaphone,
  Send,
  CheckCircle2,
  Users,
  ChevronRight,
  Plus,
} from "lucide-react";

async function getDashboardData(userId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    include: { recipients: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const allRecipients = campaigns.flatMap((c) => c.recipients);
  const totalSent = allRecipients.filter((r) => r.status === "sent").length;
  const totalFailed = allRecipients.filter((r) => r.status === "failed").length;

  return { campaigns, totalSent, totalFailed };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const { campaigns, totalSent } = await getDashboardData(session!.user.id);

  const firstName = session!.user.name?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Campaigns",
      value: String(campaigns.length),
      icon: Megaphone,
      color: "text-brand",
    },
    {
      label: "Total Sent",
      value: String(totalSent),
      icon: Send,
      color: "text-white",
    },
    { label: "Open Rate", value: "—", icon: Users, color: "text-[#A4F4FD]" },
    {
      label: "Replies",
      value: "—",
      icon: CheckCircle2,
      color: "text-[#28c840]",
    },
  ];

  return (
    <div className="p-8 overflow-y-auto h-full">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Hello, {firstName} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white/[0.02] border border-white/5 rounded-xl p-5"
          >
            <div
              className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}
            >
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-3xl font-semibold mb-1">{stat.value}</div>
            <div className="text-xs text-white/50 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* recent campaigns by user */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Recent Campaigns</h2>
            <Link
              href="/dashboard/campaigns"
              className="text-xs text-brand hover:underline font-medium"
            >
              View all
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                <Megaphone className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-sm text-white/50 mb-4">No campaigns yet</p>
              <Link
                href="/dashboard/campaigns/new"
                className="text-xs text-brand hover:underline font-medium"
              >
                Create your first campaign →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((camp) => {
                const sent = camp.recipients.filter(
                  (r) => r.status === "sent",
                ).length;
                const failed = camp.recipients.filter(
                  (r) => r.status === "failed",
                ).length;
                const pending = camp.recipients.filter(
                  (r) => r.status === "pending",
                ).length;
                const status =
                  sent > 0 ? "Sent" : pending > 0 ? "Pending" : "Draft";

                return (
                  <Link
                    key={camp.id}
                    href={`/dashboard/campaigns/${camp.id}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {camp.subject}
                      </div>
                      <div className="text-xs text-white/50 flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            status === "Sent"
                              ? "bg-brand/10 text-brand"
                              : status === "Pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-white/10 text-white/60"
                          }`}
                        >
                          {status}
                        </span>
                        • {camp.recipients.length} recipients
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right shrink-0 ml-4">
                      <div className="hidden sm:block">
                        <div className="text-xs text-white/50 mb-0.5">Sent</div>
                        <div className="text-sm font-medium">{sent}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-sm font-semibold mb-4">Quick Actions</h2>
            <Link
              href="/dashboard/campaigns/new"
              className="w-full flex items-center justify-center gap-2 bg-brand text-white rounded-lg py-3 text-sm font-medium hover:bg-brand/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Campaign
            </Link>
          </div>

          <ResumeCard userId={session!.user.id} />
        </div>
      </div>
    </div>
  );
}

async function ResumeCard({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { resumeUrl: true },
  });

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-semibold mb-4">Active Resume</h2>
      {user?.resumeUrl ? (
        <>
          <div className="border border-white/10 bg-white/[0.03] rounded-lg p-4 mb-4 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="text-[#ff5f57] w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="text-sm font-medium mb-1">Resume uploaded</div>
            <div className="text-xs text-white/50">Parsed and ready</div>
          </div>
          <Link
            href="/dashboard/settings"
            className="w-full text-xs font-medium text-white/70 hover:text-white py-2 border border-white/10 rounded-lg transition-colors flex items-center justify-center"
          >
            Update Resume
          </Link>
        </>
      ) : (
        <>
          <div className="border border-dashed border-white/10 rounded-lg p-6 mb-4 text-center">
            <div className="text-sm text-white/50 mb-1">No resume uploaded</div>
            <div className="text-xs text-white/30">
              Upload one to start generating emails
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="w-full text-xs font-medium text-brand hover:text-brand/80 py-2 border border-brand/30 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Upload Resume
          </Link>
        </>
      )}
    </div>
  );
}
