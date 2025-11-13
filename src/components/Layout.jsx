import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <nav className="sidebar">
        <h3>Inventory</h3>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
          <li><NavLink to="/sales">Sales</NavLink></li>
          <li><NavLink to="/purchases">Purchases</NavLink></li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

