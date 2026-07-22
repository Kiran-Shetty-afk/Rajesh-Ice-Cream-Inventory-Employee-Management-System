import { app, BrowserWindow, Menu, shell } from "electron";
import fs from "node:fs";
import path from "node:path";
import isDev from "electron-is-dev";
import { createServer } from "node:http";
import { parse } from "node:url";

const DEV_SERVER_URL = "http://localhost:3000";

let nextServer: any;

function ensureProductionDatabase() {
  const dbPath = path.join(app.getPath("userData"), "rajesh-icecream.db");
  const bundledDbPath = path.join(app.getAppPath(), "prisma", "dev.db");

  if (!fs.existsSync(dbPath) && fs.existsSync(bundledDbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.copyFileSync(bundledDbPath, dbPath);
  }

  process.env.DATABASE_URL = `file:${dbPath}`;
}

async function startNextJSServer() {
  const next = require("next");
  // In production, the app is packaged and .next is in the app root
  const nextApp = next({ dev: isDev, dir: app.getAppPath() });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  return new Promise<number>((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(new Error("Failed to get port"));
      }
    });
  });
}

function createWindow(port: number | null) {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    title: "Rajesh Icecream",
    backgroundColor: "#f7f4ed",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    void win.loadURL(DEV_SERVER_URL);
  } else {
    void win.loadURL(`http://127.0.0.1:${port}`);
  }
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);

  let port: number | null = null;

  if (!isDev) {
    ensureProductionDatabase();
    
    // Start Next.js embedded server
    try {
      port = await startNextJSServer();
    } catch (e) {
      console.error("Failed to start Next.js server", e);
      app.quit();
      return;
    }
  } else {
    // In dev, use the dev DB path relative to root
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), "prisma/dev.db")}`;
  }

  createWindow(port);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
