"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin) return;

    setLoading(true);
    setError(null);
    const result = await login(pin);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md surface-card p-8 shadow-soft">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-strawberry/10 text-strawberry rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Rajesh Ice Cream ERP</h1>
          <p className="text-cocoa/70 text-center mt-2">
            Enter your secure PIN to access the management system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Security PIN
            </label>
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
              className="w-full h-12 px-4 bg-vanilla/50 border border-cocoa/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-strawberry/50 focus:border-strawberry transition-all text-ink text-center text-2xl tracking-widest font-mono"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="text-strawberry text-sm text-center bg-strawberry/10 p-3 rounded-lg font-medium border border-strawberry/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full h-12 bg-strawberry hover:bg-strawberry/90 text-white rounded-lg flex items-center justify-center gap-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Access System
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
