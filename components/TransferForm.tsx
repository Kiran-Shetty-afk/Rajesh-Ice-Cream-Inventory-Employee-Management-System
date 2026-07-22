"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createTransfer } from "@/app/actions/transfers";
import { Product, Shop } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";

interface TransferFormProps {
  shops: Shop[];
  products: Product[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransferForm({ shops, products, onSuccess, onCancel }: TransferFormProps) {
  const activeShops = shops.filter((shop) => shop.isActive);
  const availableProducts = products.filter((product) => product.status === "ACTIVE" && product.factoryQuantity > 0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState(activeShops[0]?.id || "");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
    // Filter out incomplete items
    const validItems = items.filter(i => i.productId !== "" && i.quantity > 0);
    if (!shopId) {
      setError("Please add an active shop before creating a transfer.");
      return;
    }
    if (validItems.length === 0) {
      setError("Please add at least one valid product to transfer.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      shopId,
      note: (formData.get("note") as string) || undefined,
      items: validItems,
    };

    const res = await createTransfer(data);

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
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Destination Shop</label>
        <select value={shopId} onChange={(e) => setShopId(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white">
          <option value="" disabled>Select a shop</option>
          {activeShops.map(shop => (
            <option key={shop.id} value={shop.id}>{shop.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-cocoa/80">Products to Transfer</label>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              value={item.productId}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].productId = e.target.value;
                setItems(newItems);
              }}
              required
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white"
            >
              <option value="" disabled>Select product</option>
              {availableProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Max: {p.factoryQuantity})</option>
              ))}
            </select>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = parseInt(e.target.value) || 0;
                setItems(newItems);
              }}
              required
              min="1"
              className="w-24 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                className="p-2 text-cocoa/45 hover:text-strawberry transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems([...items, { productId: "", quantity: 1 }])}
          disabled={availableProducts.length === 0}
          className="flex items-center gap-1 text-sm text-strawberry font-medium hover:text-rose-700 transition-colors disabled:cursor-not-allowed disabled:text-cocoa/45"
        >
          <Plus className="w-4 h-4" /> Add another product
        </button>
        {availableProducts.length === 0 && (
          <p className="text-sm text-amber-700">No active products with factory stock are available to transfer.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Note (Optional)</label>
        <textarea name="note" rows={2} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading || activeShops.length === 0 || availableProducts.length === 0} className="primary-button">
          {loading ? "Processing..." : "Transfer Stock"}
        </button>
      </div>
    </form>
  );
}

export function TransferDialog({ shops, products, trigger }: { shops: Shop[], products: Product[], trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const canCreateTransfer = shops.some((shop) => shop.isActive) && products.some((product) => product.status === "ACTIVE" && product.factoryQuantity > 0);

  return (
    <>
      <span onClick={() => canCreateTransfer && setIsOpen(true)} className="inline-block">
        {trigger || (
          <button disabled={!canCreateTransfer} className="primary-button">
            New Transfer
          </button>
        )}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Factory Stock Transfer">
        <TransferForm shops={shops} products={products} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
