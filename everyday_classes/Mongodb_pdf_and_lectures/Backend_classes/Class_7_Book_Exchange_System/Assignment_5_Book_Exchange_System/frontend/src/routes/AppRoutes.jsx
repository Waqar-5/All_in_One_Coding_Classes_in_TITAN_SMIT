import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import AddBook from "../pages/AddBook";
import BookDetails from "../pages/BookDetails";
import EditBook from "../pages/EditBook";
import MyBooks from "../pages/MyBooks";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-books"
          element={
            <ProtectedRoute>
              <MyBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
