"use server";

import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createManualBackup(): Promise<{ success?: boolean; error?: any; message?: string }> {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.startsWith("file:")) {
      return { error: "Could not resolve local database path." };
    }

    const dbPath = dbUrl.replace("file:", "");
    if (!fs.existsSync(dbPath)) {
      return { error: "Database file not found." };
    }

    const backupDir = path.join(path.dirname(dbPath), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
    const backupFileName = `rajesh-icecream-${timestamp}.db`;
    const target = path.join(backupDir, backupFileName);
    
    fs.copyFileSync(dbPath, target);

    // Keep latest 30 backups
    const keepLatest = 30;
    const backups = fs
      .readdirSync(backupDir)
      .filter((file) => file.endsWith(".db"))
      .map((file) => ({ 
        file, 
        fullPath: path.join(backupDir, file), 
        createdAt: fs.statSync(path.join(backupDir, file)).mtimeMs 
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    for (const oldBackup of backups.slice(keepLatest)) {
      fs.unlinkSync(oldBackup.fullPath);
    }

    await prisma.backupLog.create({
      data: {
        fileName: backupFileName,
        filePath: target,
        kind: "manual",
      },
    });

    revalidatePath("/settings");
    return { success: true, message: `Backup created at ${target}` };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
