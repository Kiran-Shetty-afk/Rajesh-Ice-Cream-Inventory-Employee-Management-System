"use client";

import React from "react";
import { Power } from "lucide-react";

export function ToggleStatusForm({ 
  action, 
  isActive, 
  entityName, 
  warning 
}: { 
  action: string | ((formData: FormData) => void | Promise<void>), 
  isActive: boolean, 
  entityName: string,
  warning?: string
}) {
  return (
    <form 
      action={action} 
      onSubmit={(e) => {
        const msg = `Are you sure you want to mark ${entityName} as ${isActive ? "INACTIVE" : "ACTIVE"}?\n\n${warning || ""}`;
        if (!window.confirm(msg.trim())) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="icon-button" title={isActive ? "Mark Inactive" : "Mark Active"}>
        <Power className={`w-4 h-4 ${isActive ? "text-rose-500" : "text-emerald-500"}`} />
      </button>
    </form>
  );
}
