import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = 'attendance-token';
const USER_KEY = 'attendance-user';

/**
 * Provides authentication state (current user, token) and actions
 * (login, register, logout) to the rest of the application.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, verify it's still valid by fetching
  // the current user's profile. This also refreshes stale local user data.
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchCurrentUser();
        setUser(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      } catch (err) {
        // Token invalid/expired — clear local session
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSession = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    persistSession(res.token, res.data);
    return res;
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    persistSession(res.token, res.data);
    return res;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
