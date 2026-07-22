import { DatabaseBackup, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BackupButton } from "@/components/BackupButton";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const latestBackup = await prisma.backupLog.findFirst({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <PageHeader title="Settings" description="Local data safety, backups, restore, and optional admin security." />
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <DatabaseBackup className="mb-4 text-strawberry w-8 h-8" />
          <div className="font-semibold text-lg text-ink">Backup & Restore</div>
          <p className="mt-2 text-sm text-cocoa/70">
            Automatic daily backups keep the latest 30 database copies. Manual backups can be triggered at any time.
          </p>
          <BackupButton />
          {latestBackup && (
            <p className="mt-4 text-xs text-cocoa/60">
              Last backup: {format(new Date(latestBackup.createdAt), "dd MMM yyyy, h:mm a")} ({latestBackup.kind})
            </p>
          )}
        </div>
        <div className="surface-card p-5">
          <ShieldCheck className="mb-4 text-strawberry w-8 h-8" />
          <div className="font-semibold text-lg text-ink">Security</div>
          <p className="mt-2 text-sm text-cocoa/70">
            The app is offline-first and stores data on the owner&apos;s laptop only. Admin login has been deferred for this version.
          </p>
        </div>
      </section>
    </>
  );
}
