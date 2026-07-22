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
    <div className="min-h-screen flex items-center justify-center bg-body p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-divider">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Admin Login</h1>
          <p className="text-ink-light text-center mt-2">
            Enter your secure PIN to access the Enterprise ERP system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Security PIN
            </label>
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
              className="w-full px-4 py-3 bg-body border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-ink text-center text-2xl tracking-widest"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
