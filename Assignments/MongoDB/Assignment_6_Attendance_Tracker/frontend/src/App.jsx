import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';

/**
 * Root application component. Renders the sticky navbar, the routed
 * page content, and the footer within a full-height flex shell.
 */
function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <div className="main-content text-center text-white py-5">
              <h2>404 — Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
