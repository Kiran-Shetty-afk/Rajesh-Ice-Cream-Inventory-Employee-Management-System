"use client";

import { useEffect, useState, useTransition } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { globalSearch, type SearchResult } from "@/app/actions/search";
import clsx from "clsx";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await globalSearch(query);
        setResults(data);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <Command 
        className="w-full max-w-lg rounded-xl bg-white shadow-2xl dark:bg-black border border-orange-100 dark:border-white/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        shouldFilter={false}
      >
        <div className="flex items-center border-b border-orange-100 dark:border-white/10 px-4">
          <Search className="w-5 h-5 text-cocoa/50 dark:text-white/50" />
          <Command.Input 
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search products, shops, employees... (Ctrl+K)" 
            className="flex-1 bg-transparent border-0 h-14 px-4 text-ink outline-none placeholder:text-cocoa/40 dark:placeholder:text-white/40"
          />
          {isPending && <Loader2 className="w-4 h-4 animate-spin text-cocoa/50 dark:text-white/50" />}
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          {query.length > 0 && results.length === 0 && !isPending && (
            <Command.Empty className="py-6 text-center text-sm text-cocoa/60 dark:text-white/60">
              No results found for "{query}"
            </Command.Empty>
          )}

          {["Product", "Shop", "Employee", "Supplier"].map((type) => {
            const groupResults = results.filter((r) => r.type === type);
            if (groupResults.length === 0) return null;
            
            return (
              <Command.Group 
                key={type} 
                heading={<div className="px-2 py-1 text-xs font-semibold text-cocoa/50 dark:text-white/50 uppercase tracking-wider mt-2">{type}s</div>}
              >
                {groupResults.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      router.push(item.href);
                      setOpen(false);
                    }}
                    className={clsx(
                      "flex flex-col px-3 py-2 rounded-md cursor-pointer select-none",
                      "aria-selected:bg-vanilla dark:aria-selected:bg-white/10 aria-selected:text-ink transition-colors"
                    )}
                  >
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-cocoa/60 dark:text-white/60">{item.subtitle}</div>
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
        <div className="border-t border-orange-100 dark:border-white/10 p-3 flex justify-between items-center text-xs text-cocoa/60 dark:text-white/60">
          <div>Use <kbd className="bg-vanilla dark:bg-white/10 rounded px-1.5 py-0.5 mx-1 font-mono">↑</kbd> <kbd className="bg-vanilla dark:bg-white/10 rounded px-1.5 py-0.5 mx-1 font-mono">↓</kbd> to navigate</div>
          <div><kbd className="bg-vanilla dark:bg-white/10 rounded px-1.5 py-0.5 font-mono">Enter</kbd> to select</div>
        </div>
      </Command>
    </div>
  );
}
