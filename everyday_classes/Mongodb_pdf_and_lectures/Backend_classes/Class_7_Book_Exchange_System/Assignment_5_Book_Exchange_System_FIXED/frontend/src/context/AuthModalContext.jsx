import { createContext, useContext, useState, useCallback } from "react";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [state, setState] = useState({ open: false, mode: "login", onSuccess: null });

  const openLogin = useCallback((onSuccess) => {
    setState({ open: true, mode: "login", onSuccess: onSuccess || null });
  }, []);

  const openRegister = useCallback((onSuccess) => {
    setState({ open: true, mode: "register", onSuccess: onSuccess || null });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return (
    <AuthModalContext.Provider value={{ ...state, openLogin, openRegister, close }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within an AuthModalProvider");
  return ctx;
}
