import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ cartCount }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">✦</span>

        <span className="brand-text">
          <strong>Crumb &amp; Craft</strong>
          <small>BAKERY &amp; PATISSERIE</small>
        </span>
      </NavLink>

      <form onSubmit={handleSearch} className="search-form">
        <span className="search-icon">⌕</span>

        <input
          type="search"
          placeholder="Search cakes, flavours..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      <nav className="nav-links">
        <NavLink to="/menu">Cake Menu</NavLink>

        <NavLink to="/orders">My Orders</NavLink>

        <NavLink to="/cart" className="cart-link">
          Cart
          <span className="cart-badge">{cartCount}</span>
        </NavLink>

        <NavLink to="/login" className="account-link">
          <span>♡</span>
          Account
        </NavLink>
      </nav>
    </header>
  );
}