import { cn } from "@/lib/utils";

export function HomepageFooter({ className }: { className?: string }) {
    return (
        <footer className={cn("relative border-t bg-background/80 p-4 backdrop-blur-sm", className)}>
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p className="hidden md:block">
                    &copy; {new Date().getFullYear()} EduCentral by Johnson Digital. All Rights Reserved.
                </p>
            </div>
            <div className="absolute bottom-4 right-4">
                <p className="hidden md:block text-xs text-muted-foreground italic">
                    Powered by{' '}
                    <a
                        href="https://mindiotics.com"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        mindIoTics Tech.
                    </a>
                </p>
            </div>
        </footer>
    );
}
