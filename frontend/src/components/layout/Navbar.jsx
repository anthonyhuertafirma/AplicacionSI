import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🧠 IA Portafolio
        </Link>
        <Link to="/" className="navbar-link">
          Volver al Inicio
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;