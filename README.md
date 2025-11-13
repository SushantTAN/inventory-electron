# Inventory Management System

A simple and intuitive desktop application for local hardware stores to manage their inventory. Built with Electron, React, and Vite.

## Features

### Dashboard
- **Daily Overview:** Get a quick glance at the store's performance with "Total Sales Today" and "Total Purchases Today" displayed in summary cards.
- **Refresh Data:** A refresh button is available to refetch the data at any time.

### Product Management
- **Full CRUD:** Easily add, edit, view, and delete products.
- **Product Details:** Manage product details like name, description, quantity, and price.
- **Modal Forms:** A clean and modern UI with modal forms for adding and editing products.

### Purchase Management
- **Track Purchases:** Record new stock arrivals with details like supplier and purchase date.
- **Dynamic Items:** Add multiple products to a single purchase with a dynamic item list.
- **Automatic Stock Updates:** When a purchase is created, the stock quantity of the respective products is automatically increased.
- **View Details:** View the details of each purchase, including the list of purchased items.

### Sales Management
- **Record Sales:** Easily record sales with details like customer and sale date.
- **Stock Validation:** Prevents selling more products than are available in stock with real-time validation messages.
- **Automatic Stock Updates:** When a sale is made, the stock quantity of the respective products is automatically decreased.
- **Auto-filled Price:** The price of the product is automatically filled when a product is selected.

### User Interface
- **Responsive Sidebar:** A collapsible sidebar for easy navigation between pages.
- **Modern Styling:** A clean and modern design with improved styling for tables, forms, and buttons.
- **Icons:** Icons are used throughout the application to improve usability.
- **Light Mode:** The application is set to light mode to ensure a consistent look and feel.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Application:**
    Open two separate terminal windows.
    In the first terminal, start the React development server:
    ```bash
    npm run dev
    ```
    In the second terminal, start the Electron application:
    ```bash
    npm start
    ```

## Technologies Used
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [SQLite](https://www.sqlite.org/index.html)
- [React Router](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
