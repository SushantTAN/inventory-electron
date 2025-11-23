import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("app.db", (err) => {
  if (err) {
    console.error("Failed to open database:", err);
  } else {
    console.log("SQLite DB opened successfully.");
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          purchase_date TEXT NOT NULL,
          supplier TEXT,
          total_amount REAL NOT NULL
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS purchase_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          purchase_id INTEGER,
          product_id INTEGER,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (purchase_id) REFERENCES purchases (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sale_date TEXT NOT NULL,
          customer TEXT,
          total_amount REAL NOT NULL
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS sale_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sale_id INTEGER,
          product_id INTEGER,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (sale_id) REFERENCES sales (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
      `);
    });
  }
});

// Optional but recommended
db.exec("PRAGMA journal_mode = WAL;");

export default db;
