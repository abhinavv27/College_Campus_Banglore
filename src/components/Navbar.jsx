import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Compass, Moon, Sun, Heart, BarChart2 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme, favorites, compareList } = useContext(AppContext);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <Compass className="brand-icon" size={28} />
          <span className="brand-text">College Compass</span>
        </Link>
        
        <nav className="nav-links">
          <Link to="/course/Engineering" className="nav-link">B.Tech</Link>
          <Link to="/course/BBA" className="nav-link">BBA</Link>
          <Link to="/course/B.Com" className="nav-link">B.Com</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/compare" className="icon-btn" aria-label="Compare">
            <BarChart2 size={20} />
            {compareList.length > 0 && <span className="badge-count">{compareList.length}</span>}
          </Link>
          <Link to="/favorites" className="icon-btn" aria-label="Favorites">
            <Heart size={20} />
            {favorites.length > 0 && <span className="badge-count">{favorites.length}</span>}
          </Link>
          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
