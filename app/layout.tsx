import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Providers } from "@/components/Providers";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rajesh Icecream",
  description: "Offline inventory and employee management"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "authenticated";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-ink bg-body">
        <Providers>
          {isAuthenticated ? (
            <div className="flex min-h-screen flex-col lg:flex-row">
              <Sidebar />
              <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
            </div>
          ) : (
            <main className="min-h-screen w-full">{children}</main>
          )}
        </Providers>
      </body>
    </html>
  );
}
