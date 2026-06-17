"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { LogoMark } from "@/components/shared/logo";
import { LoginButton } from "@/components/auth/loginButton";
import VideoBackground from "@/components/layout/appBackground";
import { signIn } from "next-auth/react";

export default function LoginPage() {

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white selection:bg-brand/30 pb-20 relative">
      <VideoBackground />
      <Link
        href="/"
        className="fixed top-6 left-6 text-white/50 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Home
      </Link>

      <div className="m-auto w-full max-w-sm px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <LogoMark className="w-12 h-12 mb-8" />
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Join ColdyMailer AI
          </h1>
          <p className="text-white/50 text-sm mb-8 text-center">
            Sign up to get started.
          </p>

          <LoginButton onClick={() => signIn("google", { callbackUrl: "/dashboard" })} />

          <p className="text-xs text-white/40 mt-8 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
