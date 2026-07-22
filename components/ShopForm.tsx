"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createShop, updateShop } from "@/app/actions/shops";
import { Shop } from "@prisma/client";

interface ShopFormProps {
  shop?: Shop;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ShopForm({ shop, onSuccess, onCancel }: ShopFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      managerName: (formData.get("managerName") as string) || undefined,
      mobileNumber: (formData.get("mobileNumber") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
    };

    const res = shop
      ? await updateShop(shop.id, data)
      : await createShop(data);

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
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Shop Name</label>
        <input name="name" defaultValue={shop?.name} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Manager Name</label>
          <input name="managerName" defaultValue={shop?.managerName || ""} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Mobile Number</label>
          <input name="mobileNumber" defaultValue={shop?.mobileNumber || ""} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Address</label>
        <textarea name="address" defaultValue={shop?.address || ""} rows={3} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Saving..." : "Save Shop"}
        </button>
      </div>
    </form>
  );
}

export function ShopDialog({ shop, trigger }: { shop?: Shop, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {trigger || <button className="primary-button">Add Shop</button>}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={shop ? "Edit Shop" : "Add Shop"}>
        <ShopForm shop={shop} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
