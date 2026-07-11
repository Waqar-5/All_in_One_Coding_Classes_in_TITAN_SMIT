import { useState, useEffect } from "react";
import "./style.css";

function Both() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setVideos(data.slice(0, 20));
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <h2 className="loading">Loading amazing content...</h2>;
  }

  return (
    <div className="page">
      <h1 className="title">🎬 Premium Video Feed</h1>

      <div className="grid">
        {videos.map((video) => (
          <div key={video.id} className="card">
            <div className="thumbnail"></div>

            <h3 className="video-title">{video.title}</h3>
            <p className="video-desc">{video.body}</p>

            <button className="btn">Watch Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Both;