import axios from "axios";
import { useState } from "react";
// import "./Gallery.css";

function Gallery() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  const searchImages = async (currentPage = 1) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);

      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query,
            per_page: 6,
            page: currentPage,
          },
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_Waqar}`,
          },
        }
      );

      console.log("API Response:", response.data);

      setImages(response.data.results || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    searchImages(1);
  };

  const handlePrev = () => {
    const prevPage = page - 1;

    if (prevPage < 1) return;

    setPage(prevPage);
    searchImages(prevPage);
  };

  const handleNext = () => {
    const nextPage = page + 1;

    setPage(nextPage);
    searchImages(nextPage);
  };

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className="top-bar">
        <h1>🖼️ Image Search App</h1>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "🔄 Searching..." : "Search"}
        </button>
      </div>

      {!loading && searched && images.length === 0 && (
        <h3 className="no-results">❌ No images found</h3>
      )}

      <div className="image-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton-card" key={index}></div>
            ))
          : images.map((image) => (
              <div className="card" key={image.id}>
                <img
                  src={image.urls.small}
                  alt={image.alt_description || "Image"}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x250?text=Image+Not+Found";
                  }}
                />
              </div>
            ))}
      </div>

      {!loading && images.length > 0 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={handlePrev}>
            ⬅️ Prev
          </button>

          <span>Page {page}</span>

          <button onClick={handleNext}>
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;