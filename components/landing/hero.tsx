import Link from "next/link";
import * as motion from "motion/react-client";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { PrimaryButton } from "../shared/primaryButton";

export function Hero() {
  return (
    <section className="pt-16 md:pt-28 pb-32 text-center flex flex-col items-center max-w-6xl mx-auto px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-7xl font-semibold tracking-tight leading-none"
      >
        <div className="text-white">Cold outreach that</div>
        <div
          className="animate-shiny mt-2 pb-2"
          style={{
            backgroundImage:
              "linear-gradient(to right, #091020 0%, #0B2551 12.5%, #3D81E3 32.5%, #A4F4FD 50%, #3D81E3 67.5%, #0B2551 87.5%, #091020 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            filter: "url(#c3-noise)",
          }}
        >
          actually gets replies.
        </div>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-6 text-white/60 max-w-xl mx-auto text-base md:text-lg leading-[1.6]"
      >
        Upload your resume, describe your dream internship, and let our AI draft
        highly-personalized emails for every recruiter. Sent natively through
        your Gmail.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <Link href="/login">
          <PrimaryButton
            label="Sign in with Google"
            icon={
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            }
          />
        </Link>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <CheckCircle2 className="w-3.5 h-3.5" /> No credit card required. Free
          50 emails/mo.
        </div>
      </motion.div>
    </section>
  );
}
