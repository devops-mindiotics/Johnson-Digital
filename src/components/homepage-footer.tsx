import { cn } from "@/lib/utils";

export function HomepageFooter({ className }: { className?: string }) {
    return (
        <footer className={cn("relative border-t bg-background/80 p-4 backdrop-blur-sm", className)}>
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p className="hidden md:block">
                    &copy; {new Date().getFullYear()} Johnson Digital by Johnson Publications. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}