"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navbar } from "@/components/landing/navbar";
import { NoiseFilter } from "@/components/landing/noiseFilter";
import VideoBackground from "@/components/layout/appBackground";
import { Footer } from "@/components/landing/footer";
import { Shield, Mail, Database, XCircle, MessageSquare } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "What we collect",
    body: "We collect your Google account email, name, and profile picture when you sign in. We store OAuth tokens to send emails on your behalf via Gmail API.",
  },
  {
    icon: Mail,
    title: "How we use Gmail access",
    body: "ColdyMailer AI uses Gmail API solely to send emails you compose and approve through our platform. We never read your existing emails, contacts, or any other Gmail data.",
  },
  {
    icon: Database,
    title: "Data storage",
    body: "Your resume text is stored securely to generate personalized emails. OAuth tokens are stored encrypted. We do not sell your data to third parties.",
  },
  {
    icon: XCircle,
    title: "Revoking access",
    body: "You can revoke Gmail access anytime at myaccount.google.com/permissions. Deleting your account removes all stored data.",
  },
  {
    icon: MessageSquare,
    title: "Contact",
    body: "support@coldymailer.ai",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand/30 font-sans overflow-x-hidden relative">
      <NoiseFilter />
      <VideoBackground />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-white font-medium text-sm tracking-wide">
              Legal
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-base mb-16">Last updated: June 2025</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-panel rounded-xl border border-white/5 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {section.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm">
            Have questions?{" "}
            <Link href="/privacy" className="text-brand hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
