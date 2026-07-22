"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <CommandPalette />
    </ThemeProvider>
  );
}
