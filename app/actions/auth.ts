"use server";

import { cookies } from "next/headers";
import { withErrorHandling } from "@/lib/actions";

export async function login(pin: string): Promise<{ success?: boolean; error?: string }> {
  return withErrorHandling(async () => {
    const validPin = process.env.ADMIN_PIN || "123456";

    if (pin === validPin) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return { success: true };
    } else {
      throw new Error("Invalid PIN. Please try again.");
    }
  });
}

export async function logout(): Promise<{ success?: boolean; error?: string }> {
  return withErrorHandling(async () => {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  });
}
