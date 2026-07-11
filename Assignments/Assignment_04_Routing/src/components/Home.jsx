const Home = () => {
  return (
    <>
      <div className="hero">
        <h2>Build Amazing Websites</h2>
        <p>Modern React UI for your assignment</p>
        <button>Get Started</button>
      </div>

      <div className="container">
        <h2>Our Features</h2>

        <div className="cards">
          <div className="card">
            <h3>Fast</h3>
            <p>Optimized React performance</p>
          </div>

          <div className="card">
            <h3>Responsive</h3>
            <p>Works on all devices</p>
          </div>

          <div className="card">
            <h3>Modern</h3>
            <p>Clean UI design</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;