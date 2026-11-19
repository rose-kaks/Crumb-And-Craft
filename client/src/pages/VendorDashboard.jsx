
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import './AuthPages.css';

export default function VendorDashboard() {
  const { user, mode, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <span className="auth-icon">👩‍🍳</span>
        <h1>Baker Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>

        <div className="session-info">
          <strong>Account Role:</strong> Vendor
          <br />
          <strong>Authentication:</strong> {mode.toUpperCase()}
          <br />
          <strong>Email:</strong> {user?.email}
        </div>

        <div className="dashboard-actions">
          <Link to="/menu">View Bakery Products</Link>
          <Link to="/session-comparison">Session Details</Link>
        </div>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
