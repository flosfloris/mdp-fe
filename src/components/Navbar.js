import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Menu, X, LogOut, Settings, MessageCircle, Home, Search } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>celebration</span>
          <span className="logo-text">FestaDeiPiccoli</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cerca?tipo=location" className="nav-link">
              Esplora
            </Link>
          </li>

          {isSignedIn && (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item relative">
                <Link to="/dashboard/messaggi" className="nav-link">
                  <MessageCircle size={18} />
                  Messaggi
                  {unreadMessages > 0 && (
                    <span className="badge-unread">{unreadMessages}</span>
                  )}
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right Side */}
        <div className="navbar-right">
          {!isSignedIn ? (
            <button
              className="btn-register"
              onClick={() => navigate('/registrazione')}
            >
              Accedi
            </button>
          ) : (
            <div className="user-dropdown">
              <button
                className="btn-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user?.profileImageUrl || 'https://via.placeholder.com/40'}
                  alt="Avatar"
                  className="avatar-img"
                />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/messaggi"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <MessageCircle size={16} />
                    Messaggi
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleSignOut}>
                    <LogOut size={16} />
                    Esci
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link
            to="/"
            className="mobile-menu-link"
            onClick={() => setMenuOpen(false)}
          >
            <Home size={18} />
            Home
          </Link>
          <Link
            to="/cerca?tipo=location"
            className="mobile-menu-link"
            onClick={() => setMenuOpen(false)}
          >
            <Search size={18} />
            Esplora
          </Link>

          {isSignedIn && (
            <>
              <Link
                to="/dashboard"
                className="mobile-menu-link"
                onClick={() => setMenuOpen(false)}
              >
                <Settings size={18} />
                Dashboard
              </Link>
              <Link
                to="/dashboard/messaggi"
                className="mobile-menu-link"
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle size={18} />
                Messaggi
              </Link>
              <button
                className="mobile-menu-link logout"
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
              >
                <LogOut size={18} />
                Esci
              </button>
            </>
          )}

          {!isSignedIn && (
            <button
              className="mobile-menu-link register"
              onClick={() => {
                navigate('/registrazione');
                setMenuOpen(false);
              }}
            >
              Accedi
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
