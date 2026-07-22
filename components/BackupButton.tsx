"use client";

import { useState } from "react";
import { createManualBackup } from "@/app/actions/backup";

export function BackupButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  async function handleBackup() {
    setLoading(true);
    setMessage(null);
    const res = await createManualBackup();
    setLoading(false);
    
    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: res.message || "Backup completed successfully.", type: "success" });
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <div className="mt-4">
      <button 
        onClick={handleBackup} 
        disabled={loading}
        className="inline-flex h-9 items-center justify-center primary-button"
      >
        {loading ? "Backing up..." : "Create Manual Backup"}
      </button>
      {message && (
        <div className={`mt-3 text-sm p-3 rounded-md ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
