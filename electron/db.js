import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("app.db", (err) => {
  if (err) {
    console.error("Failed to open database:", err);
  } else {
    console.log("SQLite DB opened successfully.");
  }
});

// Optional but recommended
db.exec("PRAGMA journal_mode = WAL;");

export default db;
