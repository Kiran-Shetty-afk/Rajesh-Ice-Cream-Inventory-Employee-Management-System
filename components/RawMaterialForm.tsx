"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createRawMaterial, updateRawMaterial } from "@/app/actions/materials";
import { RawMaterial } from "@prisma/client";

interface RawMaterialFormProps {
  material?: RawMaterial;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RawMaterialForm({ material, onSuccess, onCancel }: RawMaterialFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      unit: formData.get("unit") as string,
      quantity: Number(formData.get("quantity")),
      unitCost: Number(formData.get("unitCost")),
      lowStockQuantity: Number(formData.get("lowStockQuantity")),
      supplier: (formData.get("supplier") as string) || undefined,
    };

    const res = material
      ? await updateRawMaterial(material.id, data)
      : await createRawMaterial(data);

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
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Material Name</label>
          <input name="name" defaultValue={material?.name} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Unit (e.g., kg, litre)</label>
          <input name="unit" defaultValue={material?.unit} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Quantity</label>
          <input type="number" step="0.01" name="quantity" defaultValue={material?.quantity ?? 0} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Unit Cost (₹)</label>
          <input type="number" step="0.01" name="unitCost" defaultValue={material?.unitCost} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Low Stock At</label>
          <input type="number" step="0.01" name="lowStockQuantity" defaultValue={material?.lowStockQuantity ?? 0} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Supplier (Optional)</label>
        <input name="supplier" defaultValue={material?.supplier || ""} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Saving..." : "Save Material"}
        </button>
      </div>
    </form>
  );
}

export function RawMaterialDialog({ material, trigger }: { material?: RawMaterial, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {trigger || <button className="primary-button">Add Material</button>}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={material ? "Edit Material" : "Add Material"}>
        <RawMaterialForm material={material} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
