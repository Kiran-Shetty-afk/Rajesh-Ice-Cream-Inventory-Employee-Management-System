"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Product } from "@prisma/client";

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      flavor: formData.get("flavor") as string,
      unitPrice: Number(formData.get("unitPrice")),
      factoryQuantity: Number(formData.get("factoryQuantity")),
      lowStockQuantity: Number(formData.get("lowStockQuantity")),
    };

    const res = product
      ? await updateProduct(product.id, data)
      : await createProduct(data);

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
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Product Name</label>
        <input name="name" defaultValue={product?.name} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Category</label>
          <input name="category" defaultValue={product?.category} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Flavor</label>
          <input name="flavor" defaultValue={product?.flavor} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Unit Price (₹)</label>
          <input type="number" step="0.01" name="unitPrice" defaultValue={product?.unitPrice} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Factory Qty</label>
          <input type="number" name="factoryQuantity" defaultValue={product?.factoryQuantity ?? 0} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Low Stock At</label>
          <input type="number" name="lowStockQuantity" defaultValue={product?.lowStockQuantity ?? 10} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}

export function ProductDialog({ product, trigger }: { product?: Product, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {trigger || <button className="primary-button">Add Product</button>}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={product ? "Edit Product" : "Add Product"}>
        <ProductForm product={product} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
