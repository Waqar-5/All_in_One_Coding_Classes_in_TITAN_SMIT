// The API base URL is like "http://localhost:5000/api" — uploaded images
// are served as static files from the origin without the "/api" prefix
// (see Backend/server.js: app.use("/uploads", express.static("uploads"))).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Turns a stored coverImage path (e.g. "uploads/1723-book.jpg") into an
 * absolute URL the <img> tag can load. Returns null if there's no image,
 * so callers can render a placeholder instead.
 */
export function getImageUrl(coverImage) {
  if (!coverImage) return null;
  if (/^https?:\/\//i.test(coverImage)) return coverImage; // already absolute
  const cleanPath = coverImage.replace(/^\/+/, "");
  return `${API_ORIGIN}/${cleanPath}`;
}
