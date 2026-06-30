"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { User, Mail, KeyRound, UploadCloud, FileText } from "lucide-react"

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
  const [error,     setError]     = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // client side check for valid pdf file
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB")
      return
    }

    if (file.size === 0) {
      setError("File is empty")
      return
    }

    setError(null)
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const res  = await fetch("/api/resume", {
        method: "POST",
        body:   formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setResumeUrl(data.resumeUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please try again."
      )
    } finally {
      setSaving(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-8 max-w-4xl h-full overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Sideabar navbar */}
        <div className="w-full md:w-48 flex flex-col gap-1 shrink-0">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-white/10 text-white rounded-lg">
            <User className="w-4 h-4" /> Account
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Mail className="w-4 h-4" /> Email
          </button>
        </div>

        <div className="flex-1 space-y-6 min-w-0">

          {/* Profile card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-base font-semibold mb-6">Profile</h2>
            <div className="flex items-center gap-6">
              {user.image ? (
                <img
                  src={user.image}
                  className="w-16 h-16 rounded-full"
                  alt={user.name ?? ""}
                />
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

          {/* Resume card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-white/70" /> Resume
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Your resume is parsed and used by AI to write personalized emails.
              Only PDF files under 5MB are accepted.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* status resume ka */}
            {resumeUrl ? (
              <div className="border border-white/10 bg-white/[0.03] rounded-lg p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#ff5f57]/20 p-2 rounded-md">
                    <FileText className="w-4 h-4 text-[#ff5f57]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Resume uploaded</div>
                    <div className="text-xs text-white/40 mt-0.5">
                      Parsed and active · AI will use this for emails
                    </div>
                  </div>
                </div>
                {saved && (
                  <span className="text-xs text-[#28c840] font-medium">
                    ✓ Updated
                  </span>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-lg p-8 text-center mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm text-white/40 mb-1">No resume uploaded yet</p>
                <p className="text-xs text-white/20">Upload a PDF to start generating emails</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="flex items-center gap-2 text-brand text-sm font-medium hover:text-brand/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadCloud className="w-4 h-4" />
              {saving
                ? "Uploading & parsing..."
                : resumeUrl
                ? "Replace Resume"
                : "Upload Resume PDF"}
            </button>

            {saving && (
              <p className="text-xs text-white/30 mt-2">
                Extracting text from your PDF, this may take a moment...
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
