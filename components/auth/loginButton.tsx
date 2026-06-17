import Image from "next/image";
import { Button } from "../ui/button";

export function LoginButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="w-full cursor-pointer flex items-center h-12 justify-center gap-3 bg-white text-black rounded-lg py-2.5 text-sm font-medium hover:bg-white/90 transition-colors"
    >
      <Image
        src="https://www.google.com/favicon.ico"
        alt="Google"
        width={22}
        height={22}
        className="rounded-sm"
      />
      Sign up with Google
    </Button>
  );
}
