import Link from "next/link";
import { Menu } from "lucide-react";
import * as motion from "motion/react-client";
import { LogoMark } from "./shared/logo";
import { PrimaryButton } from "./shared/primaryButton";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <LogoMark />
        <span className="font-bold tracking-tight text-xl hidden sm:block">
          ColdyMailer AI
        </span>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        {["Product", "Pricing"].map(
          (item, i) => (
            <motion.a
              key={item}
              href="#"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
            >
              {item}
            </motion.a>
          ),
        )}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link href="/login">
          <PrimaryButton label="Sign in with google" icon={null} />
        </Link>
      </div>

      <button className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
        <Menu className="w-5 h-5 text-white" />
      </button>
    </motion.nav>
  );
}
