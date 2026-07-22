"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createSupplier, updateSupplier } from "@/app/actions/suppliers";
import { Supplier } from "@prisma/client";

interface SupplierFormProps {
  supplier?: Supplier;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      contactNumber: (formData.get("contactNumber") as string) || undefined,
      gstNumber: (formData.get("gstNumber") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      paymentDue: Number(formData.get("paymentDue") || 0),
    };

    const res = supplier
      ? await updateSupplier(supplier.id, data)
      : await createSupplier(data);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Supplier Name</label>
        <input name="name" defaultValue={supplier?.name} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Contact Number</label>
          <input name="contactNumber" defaultValue={supplier?.contactNumber || ""} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">GST Number</label>
          <input name="gstNumber" defaultValue={supplier?.gstNumber || ""} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Address</label>
        <textarea name="address" defaultValue={supplier?.address || ""} rows={2} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Payment Due (₹)</label>
        <input type="number" step="0.01" min="0" name="paymentDue" defaultValue={supplier?.paymentDue || 0} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Saving..." : "Save Supplier"}
        </button>
      </div>
    </form>
  );
}

export function SupplierDialog({ supplier, trigger }: { supplier?: Supplier, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {trigger || <button className="primary-button">Add Supplier</button>}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={supplier ? "Edit Supplier" : "Add Supplier"}>
        <SupplierForm supplier={supplier} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
