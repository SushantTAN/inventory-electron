import React, { useState, useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaShoppingBag, FaBars, FaSignOutAlt } from 'react-icons/fa';
import './Layout.css';
import { AuthContext } from '../contexts/AuthContext';

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`layout ${isCollapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h3 style={{ display: isCollapsed ? 'none' : 'block' }}>Inventory</h3>
          <button onClick={toggleSidebar} className="toggle-btn">
            <FaBars />
          </button>
        </div>
        <ul>
          <li>
            <NavLink to="/dashboard" end>
              <FaTachometerAlt /> <span className="link-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products">
              <FaBox /> <span className="link-text">Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales">
              <FaShoppingCart /> <span className="link-text">Sales</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/purchases">
              <FaShoppingBag /> <span className="link-text">Purchases</span>
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="username">{user?.username}</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <FaSignOutAlt /> <span className="link-text">Logout</span>
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;


