"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  BarChart3, Boxes, Building2, FileSpreadsheet, Home, 
  IceCreamCone, Settings, Truck, Users, IndianRupee, 
  Store, ShoppingCart, Trash2, Moon, Sun, ChevronLeft, ChevronRight,
  Calendar
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/shops", label: "Shops", icon: Building2 },
  { href: "/transfers", label: "Transfers", icon: Truck },
  { href: "/sales", label: "Sales", icon: IndianRupee },
  { href: "/purchases", label: "Purchases", icon: ShoppingCart },
  { href: "/suppliers", label: "Suppliers", icon: Store },
  { href: "/wastage", label: "Wastage", icon: Trash2 },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/reports", label: "Reports", icon: FileSpreadsheet },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside 
      className={clsx(
        "flex shrink-0 flex-col border-b border-rose-100 bg-cocoa px-4 py-4 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:py-5 transition-all duration-300",
        isCollapsed ? "w-full lg:w-20" : "w-full lg:w-64"
      )}
    >
      <div className="mb-4 flex items-center justify-between lg:mb-8">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-vanilla text-strawberry shadow-sm">
            <IceCreamCone size={23} />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap transition-opacity duration-300">
              <div className="text-lg font-bold lg:text-xl">Rajesh Icecream</div>
              <div className="text-sm text-white/70">Offline inventory manager</div>
            </div>
          )}
        </div>
        {!isCollapsed && <NotificationBell />}
      </div>
      
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={clsx(
                "flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                isActive ? "bg-vanilla text-cocoa shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white",
                isCollapsed && "justify-center"
              )}
            >
              <Icon size={18} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden lg:flex flex-col gap-3">
        {isCollapsed && (
          <div className="flex justify-center w-full mb-2">
            <NotificationBell />
          </div>
        )}
        <div className="flex items-center gap-2 justify-between">
          {!isCollapsed && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors"
            >
              {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>Toggle Theme</span>
            </button>
          )}
          {isCollapsed && (
             <button
             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
             className="mx-auto text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors"
           >
             {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
           </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/75">
            Local SQLite database with daily backup support.
          </div>
        )}
      </div>
    </aside>
  );
}
