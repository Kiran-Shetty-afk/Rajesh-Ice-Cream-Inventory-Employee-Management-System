"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createWastage } from "@/app/actions/wastage";
import { Product, Shop } from "@prisma/client";

interface WastageFormProps {
  shops: Shop[];
  products: Product[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function WastageForm({ shops, products, onSuccess, onCancel }: WastageFormProps) {
  const activeShops = shops.filter((s) => s.isActive);
  const activeProducts = products.filter((p) => p.status === "ACTIVE");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationType, setLocationType] = useState<"FACTORY" | "SHOP">("FACTORY");
  const [shopId, setShopId] = useState(activeShops[0]?.id || "");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Calculate default cost based on product selection
  const selectedProduct = products.find(p => p.id === productId);
  const estimatedCost = selectedProduct ? (selectedProduct.unitPrice * quantity * 0.6) : 0; // Rough estimation of cost

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
    if (!productId) {
      setError("Please select a product.");
      return;
    }
    if (locationType === "SHOP" && !shopId) {
      setError("Please select a shop.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      date: new Date(date),
      shopId: locationType === "SHOP" ? shopId : null,
      productId,
      quantity,
      reason: (formData.get("reason") as string) || undefined,
      cost: Number(formData.get("cost") || estimatedCost),
    };

    const res = await createWastage(data);

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
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Location</label>
          <div className="flex gap-4 items-center h-9">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="location" checked={locationType === "FACTORY"} onChange={() => setLocationType("FACTORY")} className="accent-strawberry" />
              <span className="text-sm">Factory</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="location" checked={locationType === "SHOP"} onChange={() => setLocationType("SHOP")} className="accent-strawberry" />
              <span className="text-sm">Shop</span>
            </label>
          </div>
        </div>
      </div>

      {locationType === "SHOP" && (
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Select Shop</label>
          <select value={shopId} onChange={(e) => setShopId(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white">
            <option value="" disabled>Select a shop</option>
            {activeShops.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white">
            <option value="" disabled>Select a product</option>
            {activeProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} {locationType === "FACTORY" ? `(Stock: ${p.factoryQuantity})` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Quantity</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={e => setQuantity(parseInt(e.target.value) || 0)} 
            min="1"
            required 
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Estimated Cost Impact (₹)</label>
        <input 
          type="number" 
          name="cost"
          defaultValue={estimatedCost} 
          key={estimatedCost} // Force update when product changes
          min="0"
          step="0.01"
          required 
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-orange-50/30" 
        />
        <p className="text-xs text-cocoa/50 mt-1">Cost of goods lost. Pre-filled with an estimated 60% of retail price.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Reason / Note (Optional)</label>
        <textarea name="reason" rows={2} placeholder="e.g. Fridge broke down, Expired, Spilled" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading || !productId || (locationType === "SHOP" && !shopId)} className="primary-button">
          {loading ? "Saving..." : "Log Wastage"}
        </button>
      </div>
    </form>
  );
}

export function WastageDialog({ shops, products, trigger }: { shops: Shop[], products: Product[], trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const canLogWastage = products.some((p) => p.status === "ACTIVE");

  return (
    <>
      <span onClick={() => canLogWastage && setIsOpen(true)} className="inline-block">
        {trigger || (
          <button disabled={!canLogWastage} className="primary-button">
            Log Wastage
          </button>
        )}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Damage or Wastage">
        <WastageForm shops={shops} products={products} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
