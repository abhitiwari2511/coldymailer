"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  LayoutDashboard, Megaphone,
  Settings, LogOut, Coins
} from "lucide-react"
import { LogoMark } from "@/components/shared/logo"

const navItems = [
  { name: "Dashboard",  icon: LayoutDashboard, path: "/dashboard",            exact: true  },
  { name: "Campaigns",  icon: Megaphone,        path: "/dashboard/campaigns",  exact: false },
  { name: "Credits",    icon: Coins,            path: "/dashboard/credits",    exact: false },
  { name: "Settings",   icon: Settings,         path: "/dashboard/settings",   exact: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/credits")
        const data = await res.json()
        setCredits(data.credits)
      } catch {
        if (!credits) {
          return 
        }
      }
    }
    fetchCredits()
  }, [pathname]) 

  function isActive(path: string, exact: boolean) {
    return exact ? pathname === path : pathname.startsWith(path)
  }

  return (
    <aside className="w-60 border-r border-white/5 bg-black/40 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="w-6 h-6" />
          <span className="font-semibold tracking-tight">ColdyMailer AI</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-3 mt-2">
          Menu
        </div>

        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.path, item.exact)
                ? "text-brand bg-brand/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
            {item.name === "Credits" && credits !== null && (
              <span
                className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                  credits >= 5
                    ? "bg-emerald-500/10 text-emerald-400"
                    : credits > 0
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                }`}
              >
                {credits}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}