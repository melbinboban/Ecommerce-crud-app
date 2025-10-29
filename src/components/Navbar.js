import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>🛒 E-Shop</h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/add-product" className="nav-link">
            Add Product
          </Link>
        </div>
      </div>
    </nav>
  );
}
