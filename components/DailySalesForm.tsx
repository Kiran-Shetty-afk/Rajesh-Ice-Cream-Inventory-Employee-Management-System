"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDailySale } from "@/app/actions/sales";
import { Product, Shop, ShopInventory } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

type ShopWithStocks = Shop & { stocks: ShopInventory[] };

interface DailySalesFormProps {
  shops: ShopWithStocks[];
  products: Product[];
}

export function DailySalesForm({ shops, products }: DailySalesFormProps) {
  const router = useRouter();
  const activeShops = shops.filter((shop) => shop.isActive);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [shopId, setShopId] = useState(activeShops[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    { productId: "", quantity: 1, unitPrice: 0, wastage: 0, returned: 0 }
  ]);

  const selectedShop = activeShops.find(s => s.id === shopId);
  const availableProducts = (() => {
    if (!selectedShop) return [];
    return products.filter(p => {
      const stock = selectedShop.stocks.find(s => s.productId === p.id);
      return stock && stock.quantity > 0;
    });
  })();

  // When shop changes, clear items that are no longer available in the new shop
  const handleShopChange = (newShopId: string) => {
    setShopId(newShopId);
    setItems([{ productId: "", quantity: 1, unitPrice: 0, wastage: 0, returned: 0 }]);
  };

  const handleProductChange = (index: number, newProductId: string) => {
    const product = products.find(p => p.id === newProductId);
    const newItems = [...items];
    newItems[index].productId = newProductId;
    if (product) {
      newItems[index].unitPrice = product.unitPrice;
    }
    setItems(newItems);
  };

  const calculateTotal = (quantity: number, price: number) => {
    return Number((quantity * price).toFixed(2));
  };

  const grandTotal = items.reduce((acc, item) => acc + calculateTotal(item.quantity, item.unitPrice), 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
    // Filter out incomplete items
    const validItems = items.filter(i => i.productId !== "" && i.quantity > 0);
    
    if (!shopId) {
      setError("Please select a shop.");
      return;
    }
    if (validItems.length === 0) {
      setError("Please add at least one valid product sale.");
      return;
    }

    // Validate stocks locally before sending to server
    for (const item of validItems) {
      const stock = selectedShop?.stocks.find(s => s.productId === item.productId);
      const deduct = item.quantity + item.wastage;
      if (!stock || stock.quantity < deduct) {
        const pName = products.find(p => p.id === item.productId)?.name || item.productId;
        setError(`Not enough stock for ${pName}. Need ${deduct}, have ${stock?.quantity || 0}.`);
        return;
      }
    }

    setLoading(true);
    const data = {
      date: new Date(date),
      shopId,
      notes,
      items: validItems.map(item => ({
        ...item,
        totalPrice: calculateTotal(item.quantity, item.unitPrice),
      })),
    };

    const res = await createDailySale(data);

    setLoading(false);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation failed.");
    } else {
      router.push("/sales");
    }
  }

  if (activeShops.length === 0) {
    return <div className="p-8 text-center text-cocoa bg-vanilla/20 rounded-xl">No active shops found. Please add a shop first.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md font-medium">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Shop</label>
          <select 
            value={shopId} 
            onChange={(e) => handleShopChange(e.target.value)} 
            required 
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white"
          >
            {activeShops.map(shop => (
              <option key={shop.id} value={shop.id}>{shop.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-cocoa/80">Sales Items</label>
        
        {/* Desktop Header for items */}
        <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-1 mb-1 text-xs font-semibold text-cocoa/60 uppercase tracking-wider">
          <div>Product</div>
          <div>Unit Price</div>
          <div>Sold Qty</div>
          <div>Wastage</div>
          <div>Returns</div>
          <div>Total</div>
          <div className="w-8"></div>
        </div>

        {items.map((item, index) => {
          const maxStock = selectedShop?.stocks.find(s => s.productId === item.productId)?.quantity || 0;
          
          return (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-vanilla/10 p-3 sm:p-0 sm:bg-transparent rounded-lg border sm:border-0 border-vanilla/40">
              
              <div className="flex flex-col sm:block gap-1">
                <span className="sm:hidden text-xs text-cocoa/60 font-semibold uppercase">Product</span>
                <select
                  value={item.productId}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry bg-white"
                >
                  <option value="" disabled>Select product</option>
                  {availableProducts.map(p => {
                    const s = selectedShop?.stocks.find(st => st.productId === p.id)?.quantity || 0;
                    return <option key={p.id} value={p.id}>{p.name} (Stock: {s})</option>;
                  })}
                </select>
              </div>

              <div className="flex flex-col sm:block gap-1">
                 <span className="sm:hidden text-xs text-cocoa/60 font-semibold uppercase">Unit Price</span>
                 <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].unitPrice = parseFloat(e.target.value) || 0;
                    setItems(newItems);
                  }}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>

              <div className="flex flex-col sm:block gap-1">
                 <span className="sm:hidden text-xs text-cocoa/60 font-semibold uppercase">Sold Qty</span>
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
                  max={maxStock - item.wastage}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>
              
              <div className="flex flex-col sm:block gap-1">
                 <span className="sm:hidden text-xs text-cocoa/60 font-semibold uppercase">Wastage</span>
                 <input
                  type="number"
                  value={item.wastage}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].wastage = parseInt(e.target.value) || 0;
                    setItems(newItems);
                  }}
                  min="0"
                  max={maxStock - item.quantity}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>

              <div className="flex flex-col sm:block gap-1">
                 <span className="sm:hidden text-xs text-cocoa/60 font-semibold uppercase">Returns</span>
                 <input
                  type="number"
                  value={item.returned}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].returned = parseInt(e.target.value) || 0;
                    setItems(newItems);
                  }}
                  min="0"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry"
                />
              </div>

              <div className="flex items-center sm:block pt-4 sm:pt-0 gap-2">
                 <span className="sm:hidden text-xs text-cocoa/60 font-semibold uppercase">Total: </span>
                 <span className="font-bold text-ink">₹{calculateTotal(item.quantity, item.unitPrice)}</span>
              </div>

              <div className="flex justify-end">
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
            </div>
          );
        })}
        
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={() => setItems([...items, { productId: "", quantity: 1, unitPrice: 0, wastage: 0, returned: 0 }])}
            disabled={availableProducts.length === 0}
            className="flex items-center gap-1 text-sm text-strawberry font-medium hover:text-rose-700 transition-colors disabled:cursor-not-allowed disabled:text-cocoa/45"
          >
            <Plus className="w-4 h-4" /> Add another item
          </button>
          
          <div className="text-right flex flex-col items-end border-t pt-4">
             <div className="text-sm text-cocoa/70 mb-1">Total Quantity: <span className="font-semibold text-ink">{totalQuantity}</span></div>
             <div className="text-lg font-bold text-ink bg-vanilla/20 px-4 py-2 rounded-lg">Grand Total: ₹{grandTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Notes (Optional)</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2} 
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" 
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <button 
          type="button" 
          onClick={() => router.push("/sales")} 
          className="px-6 py-2.5 text-sm font-medium text-cocoa bg-white border border-cocoa/20 rounded-md hover:bg-vanilla/50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading || activeShops.length === 0 || availableProducts.length === 0} 
          className="primary-button px-6"
        >
          {loading ? "Saving..." : "Save Daily Sales"}
        </button>
      </div>
    </form>
  );
}
