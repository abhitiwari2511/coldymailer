"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navbar } from "@/components/landing/navbar";
import { NoiseFilter } from "@/components/landing/noiseFilter";
import VideoBackground from "@/components/layout/appBackground";
import { Footer } from "@/components/landing/footer";
import {
  FileText,
  UserCheck,
  Send,
  Ban,
  AlertTriangle,
  Scale,
} from "lucide-react";

const sections = [
  {
    icon: UserCheck,
    title: "Acceptance of terms",
    body: "By using ColdyMailer AI, you agree to these terms of service. If you do not agree, please do not use our platform.",
  },
  {
    icon: Send,
    title: "Use of service",
    body: "You may use ColdyMailer AI to generate and send cold outreach emails through your own Gmail account. You are solely responsible for the content of emails you send and ensuring compliance with applicable anti-spam laws.",
  },
  {
    icon: Ban,
    title: "Prohibited use",
    body: "You may not use ColdyMailer AI for any unlawful purpose, to send harassing or deceptive emails, to impersonate others, or to violate any platform policies or applicable regulations.",
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer of warranties",
    body: "ColdyMailer AI is provided \"as is\" without warranties of any kind. We do not guarantee the accuracy of AI-generated content or the deliverability of emails sent through the platform.",
  },
  {
    icon: Scale,
    title: "Limitation of liability",
    body: "To the maximum extent permitted by law, ColdyMailer AI and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
  },
  {
    icon: FileText,
    title: "Changes to terms",
    body: "We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.",
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-white/50 text-base mb-16">
            Last updated: June 2025
          </p>
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
                  <h2 className="text-lg font-semibold mb-2">
                    {section.title}
                  </h2>
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
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm">
            Also see our{" "}
            <Link href="/privacy" className="text-brand hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
