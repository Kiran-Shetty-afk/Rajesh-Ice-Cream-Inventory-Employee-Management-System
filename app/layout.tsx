import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rajesh Icecream",
  description: "Offline inventory and employee management"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-ink bg-body">
        <Providers>
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar />
            <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
