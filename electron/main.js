import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import db from "./db.js"; // ESM import for sqlite3 db.js
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

// ----------------------
// SQLite IPC Handler
// ----------------------
ipcMain.handle("db:query", async (event, { sql, params }) => {
  return new Promise((resolve, reject) => {
    const isSelect = sql.trim().toLowerCase().startsWith("select");

    if (isSelect) {
      // SELECT → db.all()
      db.all(sql, params || [], (err, rows) => {
        if (err) {
          console.error("DB SELECT Error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      // INSERT / UPDATE / DELETE → db.run()
      db.run(sql, params || [], function (err) {
        if (err) {
          console.error("DB RUN Error:", err);
          reject(err);
        } else {
          resolve({
            changes: this.changes,
            lastID: this.lastID,
          });
        }
      });
    }
  });
});

// ----------------------
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
