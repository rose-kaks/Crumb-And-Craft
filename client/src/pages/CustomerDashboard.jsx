
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import './AuthPages.css';

export default function CustomerDashboard() {
  const { user, mode, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <span className="auth-icon">🛍️</span>
        <h1>Welcome, {user?.name}!</h1>
        <p>Your sweet shopping journey starts here.</p>

        <div className="session-info">
          <strong>Account Role:</strong> Customer
          <br />
          <strong>Authentication:</strong> {mode.toUpperCase()}
          <br />
          <strong>Email:</strong> {user?.email}
        </div>

        <div className="dashboard-actions">
          <Link to="/menu">Explore Cakes</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/session-comparison">Session Details</Link>
        </div>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
