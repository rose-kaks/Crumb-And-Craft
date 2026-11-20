import { useEffect, useState } from 'react';
import { AuthContext } from './context';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(
    () => sessionStorage.getItem('cc_auth_mode') || 'jwt'
  );
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(
    () => sessionStorage.getItem('cc_jwt') || ''
  );

  // Restore existing authentication
  useEffect(() => {
    let active = true;

    async function restoreAuth() {
      try {
        const savedMode =
          sessionStorage.getItem('cc_auth_mode') || 'jwt';

        const savedToken =
          sessionStorage.getItem('cc_jwt') || '';

        if (savedMode === 'jwt' && !savedToken) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/auth/me/${savedMode}`,
          {
            credentials: 'include',
            headers: savedMode === 'jwt'
              ? { Authorization: `Bearer ${savedToken}` }
              : {}
          }
        );

        const data = await response.json();

        if (active && response.ok) {
          setUser(data.user);
          setMode(savedMode);
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Authentication restoration failed:', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreAuth();

    return () => {
      active = false;
    };
  }, []);

  // LOGIN
  const login = async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    if (credentials.mode === 'jwt') {
      sessionStorage.setItem('cc_jwt', data.token);
      setToken(data.token);
    } else {
      sessionStorage.removeItem('cc_jwt');
      setToken('');
    }

    sessionStorage.setItem('cc_auth_mode', credentials.mode);

    setMode(credentials.mode);
    setUser(data.user);

    return data;
  };

  // REGISTER CUSTOMER
  const register = async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    return data;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout/${mode}`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      sessionStorage.removeItem('cc_jwt');
      sessionStorage.removeItem('cc_auth_mode');

      setToken('');
      setUser(null);
    }
  };

  // API request helper
  const authFetch = (url, options = {}) => {
    const headers = {
      ...options.headers
    };

    if (mode === 'jwt' && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        mode,
        token,
        loading,
        login,
        register,
        logout,
        authFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}