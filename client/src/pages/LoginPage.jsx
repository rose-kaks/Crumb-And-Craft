
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    mode: 'jwt',
    expectedRole: 'customer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { expectedRole, ...credentials } = form;

      const data = await login(credentials);

      if (data.user.role !== expectedRole) {
        await logout();
        setError('This account does not belong to the selected account type.');
        return;
      }

      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.user.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else {
        navigate('/customer-dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <span className="auth-icon">🍰</span>
          <h1>Crumb & Craft</h1>
          <p>Every celebration deserves something sweet.</p>
        </div>

        <h2>Welcome Back!</h2>
        <p className="auth-subtitle">
          Sign in to continue your bakery experience.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Account Type</label>

          <select
            name="expectedRole"
            value={form.expectedRole}
            onChange={handleChange}
          >
            <option value="customer">Customer / Shopper</option>
            <option value="vendor">Baker / Vendor</option>
            <option value="admin">Administrator</option>
          </select>

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Session Management Method</label>

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
          >
            <option value="jwt">JWT Authentication</option>
            <option value="cookie">HTTP-Only Cookies</option>
            <option value="session">Server-Side Sessions</option>
          </select>

          <p className="auth-hint">
            Select an authentication method to explore
            the three session management approaches.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="auth-footer">
          New to Crumb & Craft?{' '}
          <Link to="/register">Create an account</Link>
        </p>

      </div>
    </div>
  );
}
