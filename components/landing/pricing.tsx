"use client";

import Link from "next/link";
import * as motion from "motion/react-client";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { PrimaryButton } from "../shared/primaryButton";

export function Pricing() {
  return (
    <section className="bg-black/60 border-y border-white/5 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Stop wasting time on <br className="hidden md:block" />
            cover letters.
          </h2>
          <p className="mt-5 text-white/50 text-lg leading-[1.5] max-w-md">
            Start sending personalized cold emails that actually convert to
            interviews.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "50 free AI generated emails/month",
              "Automatic Gmail dispatch",
              "Resume parsing & context extraction",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <CheckCircle2 className="w-4 h-4 text-brand" /> {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full md:w-96 rounded-2xl glass-panel p-1 border-white/20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand/20 to-transparent rounded-2xl opacity-20 pointer-events-none" />
          <div className="bg-black/80 backdrop-blur-md rounded-[14px] p-8 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-semibold">Pro Student</span>
              <span className="px-2.5 py-1 bg-[#3D81E3]/20 text-[#A4F4FD] text-xs font-semibold rounded-md tracking-wide uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </span>
            </div>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold tracking-tight">$0</span>
              <span className="text-white/40 text-sm mb-1">/ month</span>
            </div>

            <Link href="/login" className="block w-full">
              <PrimaryButton full label="Start for free" />
            </Link>

            <div className="mt-4 text-center text-xs text-white/40 font-medium">
              No credit card required. Upgrades coming soon.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
