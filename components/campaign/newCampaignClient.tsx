"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Send, X, Check, RefreshCw } from "lucide-react"

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
)

export function NewCampaignClient() {
  const router = useRouter()
  const [subject,    setSubject]    = useState("")
  const [context,    setContext]    = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [generated,  setGenerated]  = useState<{ email: string; content: string }[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [loading,    setLoading]    = useState<"create" | "generate" | "send" | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  function addEmail(value: string) {
    const emails = value.split(/[,\n\s]+/).map((e) => e.trim()).filter((e) => e && e.includes("@"))
    setRecipients((prev) => [...new Set([...prev, ...emails])])
    setEmailInput("")
  }

  function removeEmail(email: string) {
    setRecipients((prev) => prev.filter((e) => e !== email))
  }

  async function handleCreate() {
    if (!subject || !context || recipients.length === 0) {
      setError("Please fill in all fields and add at least one recipient.")
      return
    }
    setError(null)
    setLoading("create")
    try {
      const res  = await fetch("/api/campaigns", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ subject, context, recipients }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCampaignId(data.campaign.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  async function handleGenerate() {
    if (!campaignId) return
    setError(null)
    setLoading("generate")
    try {
      const res  = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ campaignId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGenerated(data.results.map((r: any) => ({ email: r.email, content: r.generatedContent })))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  async function handleSend() {
    if (!campaignId) return
    setError(null)
    setLoading("send")
    try {
      const res  = await fetch("/api/gmail/send", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ campaignId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/dashboard/campaigns/${campaignId}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  const currentPreview = generated[selectedIdx]

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* form heree */}
        <div className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-1">Subject line</h3>
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 focus-within:border-brand/50 transition-colors">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
                placeholder="e.g. Frontend Developer Internship Application"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Describe your intent</h3>
            <p className="text-xs text-white/50 mb-3">What kind of role are you targeting?</p>
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 focus-within:border-brand/50 transition-colors">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-transparent text-sm text-white resize-none outline-none min-h-[100px]"
                placeholder="e.g. Looking for a Frontend Developer Internship. Mention my experience in React, Next.js..."
              />
            </div>

            {!campaignId ? (
              <button
                onClick={handleCreate}
                disabled={loading === "create"}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-[0_0_15px_rgba(61,129,227,0.3)]"
              >
                {loading === "create" ? "Creating..." : "Save Campaign"}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading === "generate"}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-[0_0_15px_rgba(61,129,227,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                {loading === "generate" ? "Generating..." : "Generate Drafts"}
              </button>
            )}
          </div>
        </div>

        {/* Preview of Generated Drafts */}
        <div className="flex flex-col bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden shadow-inner h-[500px] xl:h-auto">
          <div className="h-12 border-b border-white/10 bg-white/[0.03] flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-xs font-medium text-white/70">
              <ChevronLeftIcon className="w-4 h-4" />
              {generated.length > 0
                ? `Preview (${selectedIdx + 1}/${generated.length})`
                : "Generated Preview"}
            </div>
            {generated.length > 0 && (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#28c840] bg-[#28c840]/10 px-2.5 py-1 rounded-full font-semibold">
                <Check className="w-3 h-3" /> Ready
              </span>
            )}
          </div>

          <div className="p-6 flex-1 overflow-y-auto text-sm text-white/80 leading-relaxed scrollbar-hide">
            {currentPreview ? (
              <div className="space-y-4 text-white/90 whitespace-pre-wrap">
                {currentPreview.content}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">
                {campaignId
                  ? "Click Generate Drafts to preview"
                  : "Fill in the form and save to generate"}
              </div>
            )}
          </div>

          {generated.length > 1 && (
            <div className="px-4 pb-3 flex gap-2">
              {generated.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                    i === selectedIdx
                      ? "border-brand text-brand bg-brand/10"
                      : "border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  {g.email.split("@")[0]}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center gap-3 shrink-0">
            <button
              onClick={handleGenerate}
              disabled={!campaignId || loading === "generate"}
              className="px-3 py-2 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 disabled:opacity-30 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button className="ml-auto px-5 py-2 flex items-center gap-2 bg-white text-black rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors">
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* panel recipients ka */}
      <div className="w-full md:w-80 bg-black/40 p-6 flex flex-col shrink-0 overflow-y-auto border-l border-white/5">
        <h3 className="text-sm font-medium mb-1">Recipients</h3>
        <p className="text-xs text-white/50 mb-4">Add recipients directly or paste a list.</p>

        <div className="border border-white/10 bg-white/[0.04] p-3 rounded-xl flex flex-col gap-2 min-h-[160px] shadow-inner mb-2 focus-within:border-white/20 transition-colors">
          {recipients.map((email) => (
            <span
              key={email}
              className="flex items-center justify-between bg-white/5 border border-white/10 px-2 py-1.5 rounded-md text-xs group"
            >
              {email}
              <X
                className="w-3.5 h-3.5 text-white/30 cursor-pointer group-hover:text-white ml-2"
                onClick={() => removeEmail(email)}
              />
            </span>
          ))}
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addEmail(emailInput)
              }
            }}
            onBlur={() => emailInput && addEmail(emailInput)}
            placeholder="Paste emails separated by commas..."
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/30 mt-2 resize-none h-12"
          />
        </div>

        <div className="text-xs text-white/40 flex items-center justify-between mb-8">
          <span>Valid emails</span>
          <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded">
            {recipients.length}
          </span>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 border-dashed">
          <button
            onClick={handleSend}
            disabled={!campaignId || generated.length === 0 || loading === "send"}
            className="w-full flex items-center justify-center gap-2 bg-brand text-white hover:bg-brand/90 disabled:opacity-40 rounded-lg py-3 text-sm font-semibold transition-all"
          >
            <Send className="w-4 h-4" />
            {loading === "send" ? "Sending..." : "Start Campaign"}
          </button>
          {!campaignId && (
            <p className="text-[10px] text-white/30 text-center mt-2">
              Save campaign first, then generate drafts
            </p>
          )}
        </div>
      </div>
    </div>
  )
}