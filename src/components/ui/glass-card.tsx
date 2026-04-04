import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "emerald" | "purple" | "none";
}

export function GlassCard({ 
  children, 
  className, 
  hover = false,
  glow = "none"
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-6",
        hover && "bg-card-hover cursor-pointer hover:shadow-lg",
        glow === "emerald" && "glow-emerald",
        glow === "purple" && "glow-purple",
        className
      )}
    >
      {children}
    </div>
  );
}
