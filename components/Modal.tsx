"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className="m-auto w-full max-w-md rounded-lg border border-orange-100/80 bg-white p-0 shadow-xl backdrop:bg-cocoa/45 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-orange-100/80 bg-vanilla/45 px-4 py-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <button onClick={onClose} className="rounded-full p-1 text-cocoa/60 transition-colors hover:bg-white hover:text-cocoa/80" aria-label="Close dialog">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </dialog>
  );
}
