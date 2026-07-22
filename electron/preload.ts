import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("rajeshApp", {
  version: "0.1.0"
});
