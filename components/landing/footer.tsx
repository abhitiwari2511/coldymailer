import Link from "next/link";
import { LogoMark } from "../shared/logo";

export function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-12 md:py-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <LogoMark className="w-6 h-6 text-white/80" />
          <span className="font-semibold text-white/80 tracking-tight">
            ColdyMailer AI
          </span>
        </div>
        <div className="flex gap-6 text-sm text-white/80 font-medium">
          <Link href="#" className="hover:text-white transition-colors">
            Twitter
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
