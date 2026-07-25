import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getFavoriteIds, toggleFavorite as toggleFavoriteApi } from "../api/favorites";
import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setLoaded(true);
      return;
    }
    try {
      const ids = await getFavoriteIds();
      setFavoriteIds(new Set(ids));
    } catch {
      // Not critical — hearts just won't show as filled until next load.
    } finally {
      setLoaded(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = (bookId) => favoriteIds.has(bookId);

  const toggle = async (bookId) => {
    if (!isAuthenticated) {
      openLogin(() => toggle(bookId));
      return;
    }

    // Optimistic update
    const wasFavorite = favoriteIds.has(bookId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      wasFavorite ? next.delete(bookId) : next.add(bookId);
      return next;
    });

    try {
      const result = await toggleFavoriteApi(bookId);
      toast.success(result.message);
    } catch (err) {
      // Roll back on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFavorite ? next.add(bookId) : next.delete(bookId);
        return next;
      });
      toast.error(err.message || "Couldn't update your wishlist.");
    }
  };

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggle, loaded, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
