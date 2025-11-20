import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'blue' | 'white';
}

export function Logo({ className, iconOnly = false, variant = 'blue' }: LogoProps) {
  const logoSrc = variant === 'white' ? "/JPDigital-White.svg" : "/JPDigital-Blue.svg";

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 font-extrabold",
        variant === 'blue' ? 'text-blue-700' : '',
        className
      )}
    >
      <Image
        src={logoSrc}
        alt="Johnson Logo"
        width={200}
        height={200}
        priority
        style={{ height: 'auto' }}
      />
    </div>
  );
}
