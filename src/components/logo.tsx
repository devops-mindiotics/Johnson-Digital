import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 font-extrabold text-blue-700",
        className
      )}
    >
      {/* ✅ Correct public path (no local disk path) */}
      <Image
        src="/JPDigital-White.svg"
        alt="Johnson Logo"
        width={200}
        height={200}
        priority
      />

      
    </div>
  );
}
