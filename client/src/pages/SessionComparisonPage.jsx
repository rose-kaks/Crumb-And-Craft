
import { useAuth } from '../context/auth';
import { Link } from 'react-router-dom';
import './AuthPages.css';

const methods = {
  jwt: {
    title: 'JSON Web Token',
    storage: 'Client-side sessionStorage',
    transmission: 'Authorization: Bearer token',
    server: 'Stateless verification',
    logout: 'Client discards token; token remains valid until expiry'
  },

  cookie: {
    title: 'HTTP-Only Cookie',
    storage: 'Browser HTTP-Only cookie',
    transmission: 'Automatically sent by browser',
    server: 'Stateless JWT verification',
    logout: 'Authentication cookie cleared'
  },

  session: {
    title: 'Server-Side Session',
    storage: 'MongoDB sessions collection',
    transmission: 'Session ID cookie',
    server: 'Session lookup in MongoDB',
    logout: 'Server-side session destroyed'
  }
};

export default function SessionComparisonPage() {
  const { user, mode } = useAuth();

  const active = methods[mode];

  return (
    <div className="dashboard-page">
      <div className="dashboard-card comparison-card">

        <h1>Session Management</h1>
        <p>Crumb & Craft authentication experiment</p>

        <div className="session-info">
          <strong>Authenticated User:</strong> {user?.name}
          <br />
          <strong>Role:</strong> {user?.role}
          <br />
          <strong>Active Method:</strong> {active.title}
        </div>

        <h2>Active Authentication Details</h2>

        <div className="comparison-detail">
          <strong>Storage</strong>
          <p>{active.storage}</p>
        </div>

        <div className="comparison-detail">
          <strong>Transmission</strong>
          <p>{active.transmission}</p>
        </div>

        <div className="comparison-detail">
          <strong>Server Behaviour</strong>
          <p>{active.server}</p>
        </div>

        <div className="comparison-detail">
          <strong>Logout Behaviour</strong>
          <p>{active.logout}</p>
        </div>

        <h2>Comparison of All Methods</h2>

        {Object.entries(methods).map(([key, method]) => (
          <div className="comparison-detail" key={key}>
            <strong>{method.title}</strong>
            <p>{method.storage}</p>
            <p>{method.server}</p>
            {key === mode && <span>Currently Active ✓</span>}
          </div>
        ))}

        <Link to="/">Return Home</Link>

      </div>
    </div>
  );
}
