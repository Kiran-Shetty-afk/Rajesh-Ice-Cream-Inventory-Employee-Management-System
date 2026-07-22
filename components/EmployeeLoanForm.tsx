"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createEmployeeLoan } from "@/app/actions/employees";

interface EmployeeLoanFormProps {
  employeeId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmployeeLoanForm({ employeeId, onSuccess, onCancel }: EmployeeLoanFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      employeeId,
      amount: Number(formData.get("amount")),
      loanDate: new Date(formData.get("loanDate") as string),
      note: (formData.get("note") as string) || undefined,
    };

    const res = await createEmployeeLoan(data);

    setLoading(false);
    if (res.error) {
      if (typeof res.error === "string") {
        setError(res.error);
      } else {
        setError("Validation failed. Please check your inputs.");
      }
    } else {
      onSuccess();
    }
  }

  const defaultDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Loan Amount (₹)</label>
          <input type="number" step="0.01" name="amount" required min="1" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Date</label>
          <input type="date" name="loanDate" defaultValue={defaultDate} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Note / Reason</label>
        <textarea name="note" rows={2} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Adding..." : "Add Loan"}
        </button>
      </div>
    </form>
  );
}

export function EmployeeLoanDialog({ employeeId, trigger }: { employeeId: string, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {trigger || <button className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium hover:bg-amber-200">Add Loan</button>}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Issue Employee Loan">
        <EmployeeLoanForm employeeId={employeeId} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
