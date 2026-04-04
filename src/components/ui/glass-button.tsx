import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "emerald" | "purple" | "ghost";
}

export function GlassButton({ 
  children, 
  className, 
  variant = "emerald",
  ...props 
}: GlassButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  
  const variants = {
    emerald: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110 hover:shadow-lg active:scale-[0.98]",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:brightness-110 hover:shadow-lg active:scale-[0.98]",
    ghost: "glass-card-hover text-slate-200 hover:text-white"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
