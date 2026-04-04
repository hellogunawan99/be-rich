"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  PiggyBank, 
  Target, 
  Receipt, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Transactions", href: "/transactions", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-gradient-emerald">BeRich</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <nav className="px-4 pb-4 space-y-2 border-t border-border pt-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-all mt-4"
            >
              <LogOut className="size-5" />
              Sign Out
            </button>
          </nav>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-72 flex-col bg-card border-r border-border mr-4">
        <div className="flex h-20 items-center justify-center border-b border-border">
          <h1 className="text-3xl font-bold text-gradient-emerald">BeRich</h1>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="size-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-all"
          >
            <LogOut className="size-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
