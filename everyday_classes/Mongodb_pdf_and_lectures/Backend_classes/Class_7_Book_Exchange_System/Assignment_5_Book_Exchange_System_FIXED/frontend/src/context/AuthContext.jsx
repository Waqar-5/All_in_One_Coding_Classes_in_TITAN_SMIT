import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/auth";
import { getToken, setToken, clearToken } from "../api/axios";

const AuthContext = createContext(null);

const USER_KEY = "chapter-verse-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(true);

  // Keep localStorage in sync whenever the user changes.
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  // If a request ever 401s, axios clears the token — make sure the UI
  // reflects "logged out" too by polling for token/user mismatch on mount.
  useEffect(() => {
    if (!getToken() && user) {
      setUser(null);
    }
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (details) => {
    const data = await registerUser(details);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, ready, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
