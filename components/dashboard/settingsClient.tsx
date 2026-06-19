"use client"

import { useState } from "react"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { User, Mail, KeyRound, UploadCloud } from "lucide-react"

interface Props {
  user: {
    name:      string | null
    email:     string | null
    image:     string | null
    resumeUrl: string | null
  }
}

export function SettingsClient({ user }: Props) {
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  async function handleUpload(result: CloudinaryUploadWidgetResults) {
    if (typeof result.info !== "object" || !result.info) return

    const url = result.info.secure_url
    setSaving(true)

    try {
      await fetch("/api/resume", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ resumeUrl: url }),
      })
      setResumeUrl(url)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl max-h-full overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Nav */}
        <div className="w-full md:w-48 flex flex-col gap-1 shrink-0">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-white/10 text-white rounded-lg">
            <User className="w-4 h-4" /> Account
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Mail className="w-4 h-4" /> Email
          </button>
        </div>

        <div className="flex-1 space-y-6 min-w-0">
          {/* Profile */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-base font-semibold mb-6">Profile</h2>

            <div className="flex items-center gap-6 mb-8">
              {user.image ? (
                <img src={user.image} className="w-16 h-16 rounded-full" alt={user.name ?? ""} />
              ) : (
                <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center text-brand text-xl font-bold border border-brand/30">
                  {user.name?.[0] ?? "?"}
                </div>
              )}
              <div>
                <div className="text-base font-medium">{user.name}</div>
                <div className="text-sm text-white/50">{user.email}</div>
                <div className="text-xs text-white/30 mt-1">Connected via Google</div>
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-white/70" /> Resume
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Your resume is parsed and used by AI to write personalized emails.
            </p>

            {resumeUrl ? (
              <div className="border border-white/10 bg-white/[0.03] rounded-lg p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#ff5f57]/20 p-2 rounded-md">
                    <svg className="w-4 h-4 text-[#ff5f57]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Resume uploaded</div>
                    <div className="text-xs text-white/40 mt-0.5">Parsed and active</div>
                  </div>
                </div>
                {saved && <span className="text-xs text-[#28c840] font-medium">✓ Updated</span>}
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-lg p-6 text-center mb-4">
                <p className="text-sm text-white/40">No resume uploaded yet</p>
              </div>
            )}

            <CldUploadWidget
              signatureEndpoint="/api/resume/sign"
              onSuccess={handleUpload}
              options={{
                folder:               "coldmail-resumes",
                resourceType:         "raw",
                clientAllowedFormats: ["pdf"],
                maxFileSize:          5000000,
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  disabled={saving}
                  className="flex items-center gap-2 text-brand text-sm font-medium hover:text-brand/80 transition-colors disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  {saving ? "Processing..." : resumeUrl ? "Replace Resume" : "Upload Resume PDF"}
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      </div>
    </div>
  )
}