"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Building2, FileSpreadsheet, Home, IceCreamCone, Settings, Truck, Users, IndianRupee } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/shops", label: "Shops", icon: Building2 },
  { href: "/transfers", label: "Transfers", icon: Truck },
  { href: "/sales", label: "Sales", icon: IndianRupee },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/reports", label: "Reports", icon: FileSpreadsheet },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-rose-100 bg-cocoa px-4 py-4 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:py-5">
      <div className="mb-4 flex items-center gap-3 lg:mb-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-vanilla text-strawberry shadow-sm">
          <IceCreamCone size={23} />
        </div>
        <div>
          <div className="text-lg font-bold lg:text-xl">Rajesh Icecream</div>
          <div className="text-sm text-white/70">Offline inventory manager</div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                isActive ? "bg-vanilla text-cocoa shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/75 lg:block">
        Local SQLite database with daily backup support.
      </div>
    </aside>
  );
}
