"use client"

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"

export default function ResumeUpload() {

  async function handleUpload(result: CloudinaryUploadWidgetResults) {
     if (typeof result.info !== "object" || !result.info) return
    const url = result.info.secure_url

    // Step 2 — save URL to your DB via API
    await fetch("/api/resume", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ resumeUrl: url }),
    })
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/resume/sign" 
      onSuccess={handleUpload}
      options={{
        folder:         "coldmail-resumes",
        resourceType:   "raw",              // for PDFs
        clientAllowedFormats: ["pdf"],      // only PDFs allowed
        maxFileSize:    5000000,            // 5MB max
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>
          Upload Resume PDF
        </button>
      )}
    </CldUploadWidget>
  )
}