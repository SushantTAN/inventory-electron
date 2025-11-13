const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  runQuery: (sql, params) => ipcRenderer.invoke("db:query", { sql, params })
});
