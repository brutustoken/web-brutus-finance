import React from 'react';
import { Link } from 'react-router-dom';
import { GlitchText } from '../GlitchText/GlitchText';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <GlitchText text="BRUTUS" intensity="low" />
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">HOME</Link>
          <Link to="/games" className="navbar-link">GAMES</Link>
          <Link to="/leaderboard" className="navbar-link">LEADERBOARD</Link>
        </div>
      </div>
    </nav>
  );
};