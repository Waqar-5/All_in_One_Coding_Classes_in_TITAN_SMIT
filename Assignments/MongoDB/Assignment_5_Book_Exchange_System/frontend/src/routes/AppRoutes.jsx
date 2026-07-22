import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home";
import Books from "../pages/Books";
import AddBook from "../pages/AddBook";
import BookDetails from "../pages/BookDetails";
import EditBook from "../pages/EditBook";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<AddBook />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/edit/:id" element={<EditBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
