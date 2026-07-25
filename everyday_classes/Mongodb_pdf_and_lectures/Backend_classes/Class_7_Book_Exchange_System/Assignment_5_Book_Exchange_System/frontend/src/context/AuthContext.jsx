import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getMyProfile } from "../api/auth";
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
  const [ready, setReady] = useState(false);

  // Keep localStorage in sync whenever the user changes.
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  // On mount, don't just trust the cached user from localStorage — it can
  // go stale (e.g. a role change made directly in the database, or from
  // the admin panel by someone else) and there'd be no way to pick that
  // up short of manually logging out and back in. Re-fetch from the
  // server once on load instead, so the source of truth is always the DB.
  useEffect(() => {
    const refreshFromServer = async () => {
      if (!getToken()) {
        setUser(null);
        setReady(true);
        return;
      }

      try {
        const data = await getMyProfile();
        setUser(data.user);
      } catch {
        // Token invalid/expired — axios interceptor already cleared it.
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    refreshFromServer();
  }, []);

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

  // Lets the Profile page (or anything else) push a fresh user object into
  // context + localStorage after an edit, without a full re-login.
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, ready, login, register, logout, updateUser }}
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
