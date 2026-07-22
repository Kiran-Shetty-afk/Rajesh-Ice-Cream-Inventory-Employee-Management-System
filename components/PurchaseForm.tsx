"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createPurchase } from "@/app/actions/purchases";
import { Product, Supplier } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";

interface PurchaseFormProps {
  suppliers: Supplier[];
  products: Product[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function PurchaseForm({ suppliers, products, onSuccess, onCancel }: PurchaseFormProps) {
  const activeSuppliers = suppliers.filter((s) => s.isActive);
  const activeProducts = products.filter((p) => p.status === "ACTIVE");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [supplierId, setSupplierId] = useState(activeSuppliers[0]?.id || "");
  const [items, setItems] = useState([{ productId: "", quantity: 1, costPrice: 0, mfgDate: "", expiryDate: "" }]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
    const validItems = items.filter(i => i.productId !== "" && i.quantity > 0 && i.costPrice >= 0);
    if (!supplierId) {
      setError("Please add an active supplier before creating a purchase.");
      return;
    }
    if (validItems.length === 0) {
      setError("Please add at least one valid product to purchase.");
      return;
    }
    if (!invoiceNumber.trim()) {
      setError("Invoice number is required.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      supplierId,
      invoiceNumber: invoiceNumber.trim(),
      purchaseDate: new Date(purchaseDate),
      note: (formData.get("note") as string) || undefined,
      items: validItems.map(item => ({
        ...item,
        mfgDate: item.mfgDate ? new Date(item.mfgDate) : undefined,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
      })),
    };

    const res = await createPurchase(data);

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

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Supplier</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white">
            <option value="" disabled>Select a supplier</option>
            {activeSuppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Invoice Number</label>
          <input 
            type="text" 
            value={invoiceNumber} 
            onChange={e => setInvoiceNumber(e.target.value)} 
            required 
            placeholder="INV-12345"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Purchase Date</label>
        <input 
          type="date" 
          value={purchaseDate} 
          onChange={e => setPurchaseDate(e.target.value)} 
          required 
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" 
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-cocoa/80">Products Purchased</label>
        {items.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-end gap-2 border sm:border-0 p-3 sm:p-0 rounded-md">
            <div className="w-full sm:flex-1">
              <label className="block sm:hidden text-xs text-cocoa/60 mb-1">Product</label>
              <select
                value={item.productId}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].productId = e.target.value;
                  setItems(newItems);
                }}
                required
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white"
              >
                <option value="" disabled>Select product</option>
                {activeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="w-24">
                <label className="block sm:hidden text-xs text-cocoa/60 mb-1">Quantity</label>
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
                  placeholder="Qty"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>
              <div className="w-32">
                <label className="block sm:hidden text-xs text-cocoa/60 mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  value={item.costPrice}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].costPrice = parseFloat(e.target.value) || 0;
                    setItems(newItems);
                  }}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>
              <div className="w-32">
                <label className="block sm:hidden text-xs text-cocoa/60 mb-1">Mfg Date</label>
                <input
                  type="date"
                  value={item.mfgDate}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].mfgDate = e.target.value;
                    setItems(newItems);
                  }}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>
              <div className="w-32">
                <label className="block sm:hidden text-xs text-cocoa/60 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].expiryDate = e.target.value;
                    setItems(newItems);
                  }}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  className="p-2 text-cocoa/45 hover:text-strawberry transition-colors mt-auto sm:mt-0"
                >
                  <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center px-1">
          <button
            type="button"
            onClick={() => setItems([...items, { productId: "", quantity: 1, costPrice: 0, mfgDate: "", expiryDate: "" }])}
            disabled={activeProducts.length === 0}
            className="flex items-center gap-1 text-sm text-strawberry font-medium hover:text-rose-700 transition-colors disabled:cursor-not-allowed disabled:text-cocoa/45"
          >
            <Plus className="w-4 h-4" /> Add product
          </button>
          <div className="text-sm font-semibold text-ink bg-orange-50 px-3 py-1.5 rounded-md">
            Total: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
        {activeProducts.length === 0 && (
          <p className="text-sm text-amber-700">No active products available to purchase.</p>
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
        <button type="submit" disabled={loading || activeSuppliers.length === 0 || activeProducts.length === 0} className="primary-button">
          {loading ? "Processing..." : "Save Purchase"}
        </button>
      </div>
    </form>
  );
}

export function PurchaseDialog({ suppliers, products, trigger }: { suppliers: Supplier[], products: Product[], trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const canCreatePurchase = suppliers.some((s) => s.isActive) && products.some((p) => p.status === "ACTIVE");

  return (
    <>
      <span onClick={() => canCreatePurchase && setIsOpen(true)} className="inline-block">
        {trigger || (
          <button disabled={!canCreatePurchase} className="primary-button">
            New Purchase
          </button>
        )}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Purchase Entry">
        <PurchaseForm suppliers={suppliers} products={products} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
