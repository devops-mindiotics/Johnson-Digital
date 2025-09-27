import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, iconOnly = false }: { className?: string, iconOnly?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 font-extrabold text-white',
        className
      )}
    >
      <BookOpenCheck className="h-8 w-8" />
      {!iconOnly && <span className="text-2xl">EduCentral</span>}
    </div>
  );
}
