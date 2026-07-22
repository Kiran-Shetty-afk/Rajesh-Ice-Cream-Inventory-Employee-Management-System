import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "..");
const dbPath = path.join(projectRoot, "prisma", "dev.db");
const backupDir = path.join(projectRoot, "backups");
const keepLatest = 30;

function timestamp() {
  return new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
}

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found at ${dbPath}`);
  process.exit(1);
}

fs.mkdirSync(backupDir, { recursive: true });

const target = path.join(backupDir, `rajesh-icecream-${timestamp()}.db`);
fs.copyFileSync(dbPath, target);

const backups = fs
  .readdirSync(backupDir)
  .filter((file) => file.endsWith(".db"))
  .map((file) => ({ file, fullPath: path.join(backupDir, file), createdAt: fs.statSync(path.join(backupDir, file)).mtimeMs }))
  .sort((a, b) => b.createdAt - a.createdAt);

for (const oldBackup of backups.slice(keepLatest)) {
  fs.unlinkSync(oldBackup.fullPath);
}

console.log(`Backup created: ${target}`);
