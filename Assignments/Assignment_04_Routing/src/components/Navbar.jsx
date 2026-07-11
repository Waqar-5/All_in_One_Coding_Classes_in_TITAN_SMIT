import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar">
      <h1>MySite</h1>

      {/* HAMBURGER */}
      <div 
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </div>

      {/* NAV LINKS */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "active-link" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? "active-link" : ""}
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? "active-link" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default Navbar;