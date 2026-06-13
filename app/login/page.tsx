"use client"

import { signIn } from "next-auth/react"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold text-gray-900">ColdMail AI</h1>
          <p className="text-sm text-gray-500">Send smarter outreach emails</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "http://localhost:3000/dashboard" })}
          className="flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
        >
          <Image
            src="https://www.google.com/favicon.ico" 
            alt="Google"
            width={16}
            height={16}
          />
          Continue with Google
        </button>

      </div>
    </div>
  )
}