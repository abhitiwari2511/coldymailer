import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { NewCampaignClient } from "@/components/campaign/newCampaignClient"

export default function NewCampaignPage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
      <div className="flex-1 flex flex-col border-r border-white/5 min-w-0">
        <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0 bg-black/20">
          <div className="flex items-center text-sm font-medium">
            <Link href="/dashboard/campaigns" className="text-white/50 hover:text-white transition-colors">
              Campaigns
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/30" />
            <span className="text-white">New Campaign</span>
          </div>
        </div>
        <NewCampaignClient />
      </div>
    </div>
  )
}