
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password
      });

      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => navigate('/login'), 1200);

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
          <span className="auth-icon">🧁</span>
          <h1>Crumb & Craft</h1>
          <p>Join our little world of sweetness.</p>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Register as a customer and start exploring.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm({
              ...form,
              name: e.target.value
            })}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={e => setForm({
              ...form,
              email: e.target.value
            })}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={e => setForm({
              ...form,
              password: e.target.value
            })}
            minLength={8}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={e => setForm({
              ...form,
              confirmPassword: e.target.value
            })}
            required
          />

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
