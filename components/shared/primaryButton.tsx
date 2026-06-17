import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PrimaryButtonProps {
  label?: string
  full?: boolean
  icon?: React.ReactNode | null
}

export function PrimaryButton({
  label = "Start for free",
  full = false,
  icon = <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-px" />,
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center gap-2 h-11 rounded-full bg-white text-black font-medium text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98]",
        full && "w-full"
      )}
    >
      {label}
      {icon}
    </Button>
  )
}
