import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="surface-card overflow-hidden p-5">
      <div className="mb-4 h-1 w-16 rounded-full bg-strawberry" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-cocoa/65">{label}</div>
          <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pistachio/70 text-cocoa">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 text-sm text-cocoa/70">{detail}</div>
    </div>
  );
}
