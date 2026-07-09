"use client";

import { useState, useEffect } from "react";
import {
  Coins,
  Zap,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Crown,
  Rocket,
  Check,
  Loader2,
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

interface CreditPack {
  id: string;
  credits: number;
  price: number;
  label: string;
}

const REASON_LABELS: Record<string, string> = {
  generate_emails: "Email Generation",
  send_campaign: "Campaign Sent",
  purchase_starter: "Starter Pack Purchase",
  purchase_growth: "Growth Pack Purchase",
  purchase_professional: "Professional Pack Purchase",
  trial_bonus: "Free Trial Bonus",
};

const PACK_ICONS: Record<string, typeof Sparkles> = {
  starter: Sparkles,
  growth: Rocket,
  professional: Crown,
};

const PACK_COLORS: Record<string, string> = {
  starter: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  growth: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  professional: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
};

const PACK_ACCENT: Record<string, string> = {
  starter: "text-blue-400",
  growth: "text-violet-400",
  professional: "text-amber-400",
};

const PACK_BTN: Record<string, string> = {
  starter: "bg-blue-500 hover:bg-blue-600",
  growth: "bg-violet-500 hover:bg-violet-600",
  professional: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
};

export function CreditsClient({ initialCredits }: { initialCredits: number }) {
  const [credits, setCredits] = useState(initialCredits);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [buying, setBuying] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [creditsResponse, packsResponse] = await Promise.all([
          fetch("/api/credits"),
          fetch("/api/credits/buy"),
        ]);
        const creditsData = await creditsResponse.json();
        const packsData = await packsResponse.json();
        setCredits(creditsData.credits);
        setTransactions(creditsData.transactions);
        setPacks(packsData.packs);
      } catch {
        if (!buying) {
          setTransactions([]);
        }
      } finally {
        setLoadingHistory(false);
      }
    }
    fetchData();
  }, [buying]);

  async function handleBuy(packId: string) {
    setBuying(packId);
    try {
      const res = await fetch("/api/credits/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCredits(data.newBalance);

      // Refresh transactions
      const creditsRes = await fetch("/api/credits");
      const creditsData = await creditsRes.json();
      setTransactions(creditsData.transactions);
    } catch (err) {
      console.error("Purchase failed:", err);
    } finally {
      setBuying(null);
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Determine credit status for the gauge
  const creditStatus =
    credits >= 8
      ? { label: "Healthy", color: "text-emerald-400", bg: "bg-emerald-400" }
      : credits >= 3
        ? { label: "Low", color: "text-yellow-400", bg: "bg-yellow-400" }
        : { label: "Critical", color: "text-red-400", bg: "bg-red-400" };

  return (
    <div className="p-8 max-w-5xl h-full scroll-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
          <Coins className="w-5 h-5 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Credits</h1>
          <p className="text-sm text-white/50">
            Manage your credit balance and purchase more
          </p>
        </div>
      </div>

      {/* Credit Balance Card */}
      <div className="bg-gradient-to-br from-brand/10 via-white/[0.02] to-white/[0.02] border border-brand/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm text-white/50 font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand" />
              Available Credits
            </div>
            <div className="text-6xl font-bold tracking-tight mb-2">
              {credits}
            </div>
            <div className={`text-sm font-medium flex items-center gap-2 ${creditStatus.color}`}>
              <span className={`w-2 h-2 rounded-full ${creditStatus.bg} animate-pulse`} />
              {creditStatus.label}
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
              <TrendingUp className="w-4 h-4 text-brand" />
              <div>
                <div className="text-white/50 text-xs">Cost per action</div>
                <div className="font-medium">1 credit</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-white/50 text-xs">Actions remaining</div>
                <div className="font-medium">{credits} actions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Buy Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packs.map((pack) => {
            const Icon = PACK_ICONS[pack.id] ?? Sparkles;
            const colorClass = PACK_COLORS[pack.id] ?? PACK_COLORS.starter;
            const accentClass = PACK_ACCENT[pack.id] ?? PACK_ACCENT.starter;
            const btnClass = PACK_BTN[pack.id] ?? PACK_BTN.starter;
            const isBuying = buying === pack.id;
            const pricePerCredit = (pack.price / pack.credits / 100).toFixed(2);

            return (
              <div
                key={pack.id}
                className={`bg-gradient-to-br ${colorClass} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${accentClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-semibold mb-1">{pack.label}</h3>
                <div className="text-3xl font-bold mb-1">
                  {pack.credits}{" "}
                  <span className="text-base font-normal text-white/50">
                    credits
                  </span>
                </div>
                <div className="text-xs text-white/40 mb-4">
                  ${pricePerCredit} per credit
                </div>

                <div className="space-y-2 mb-5 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white/40" />
                    {pack.credits} email generations
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white/40" />
                    {pack.credits} campaign sends
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white/40" />
                    Never expires
                  </div>
                </div>

                <button
                  disabled={isBuying || buying !== null}
                  className={`w-full ${btnClass} text-white rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {/* {isBuying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Buy for ${(pack.price / 100).toFixed(2)}
                    </>
                  )} */}

                  Coming Soon...
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          {loadingHistory ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white/40" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coins className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-sm text-white/50 mb-1">No transactions yet</p>
              <p className="text-xs text-white/30">
                Credits will be logged here when you use them
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === "credit"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {REASON_LABELS[tx.reason] ?? tx.reason}
                      </div>
                      <div className="text-xs text-white/40">
                        {formatDate(tx.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div
                      className={`text-sm font-semibold ${
                        tx.type === "credit"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {tx.amount}
                    </div>
                    <div className="text-xs text-white/30 w-16 text-right">
                      Bal: {tx.balanceAfter}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
