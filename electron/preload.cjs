const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  runQuery: (sql, params) => ipcRenderer.invoke("db:query", { sql, params }),
  register: (username, password) => ipcRenderer.invoke("auth:register", { username, password }),
  login: (username, password) => ipcRenderer.invoke("auth:login", { username, password }),
});
