import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AuthModalProvider } from "./context/AuthModalContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FavoritesProvider>
        </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
