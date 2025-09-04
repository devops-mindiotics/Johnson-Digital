import { cn } from "@/lib/utils";

export function DashboardFooter({ className }: { className?: string }) {
    return (
        <footer className={cn("border-t bg-background/80 p-4 backdrop-blur-sm", className)}>
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} EduCentral by Johnson Digital. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
