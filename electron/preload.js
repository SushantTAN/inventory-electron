import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  runQuery: (sql, params) => ipcRenderer.invoke("db:query", { sql, params })
});
