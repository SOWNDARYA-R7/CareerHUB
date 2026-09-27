import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        return response.json();
      })
      .then((data) => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load news");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">◆</span>
          <span>Career<span>Hub</span></span>
        </div>

        <div className="nav-links">
          <a href="#news">News</a>
          <a href="#learning">Learning</a>
          <a href="#internships">Internships</a>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">YOUR CAREER JOURNEY STARTS HERE</p>

            <h1>
              Learn. Explore.
              <br />
              <span>Build Your Career.</span>
            </h1>

            <p className="hero-description">
              Discover learning resources, internships and the latest
              technology & career opportunities in one place.
            </p>

            <div className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search a domain or skill..."
              />

              <button>Search</button>
            </div>
          </div>
        </section>

        {/* News */}
        <section className="news-section" id="news">
          <div className="section-heading">
            <div>
              <p className="section-label">STAY UPDATED</p>
              <h2>Latest Technology & Career News</h2>
            </div>

            <span className="live-badge">
              <span></span> Updated Daily
            </span>
          </div>

          {loading && (
            <div className="status">
              <div className="loader"></div>
              <p>Loading latest news...</p>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <div className="news-grid">
              {news.map((item, index) => (
                <a
                  className="news-card"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <div className="news-image-wrapper">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="news-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        NEWS
                      </div>
                    )}
                  </div>

                  <div className="news-content">
                    <div className="news-meta">
                      <span>{item.source || "News"}</span>
                      <span>{item.date || ""}</span>
                    </div>

                    <h3>{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Future sections */}
        <section className="coming-section" id="learning">
          <p className="section-label">COMING NEXT</p>
          <h2>Learning Resources</h2>
          <p>
            Find courses, tutorials, documentation and projects
            based on your chosen domain.
          </p>
        </section>

        <section className="coming-section" id="internships">
          <p className="section-label">COMING NEXT</p>
          <h2>Domain Internships</h2>
          <p>
            Discover internship opportunities related to your
            skills and career interests.
          </p>
        </section>
      </main>

      <footer>
        <p>CareerHub • Learn → Build → Grow</p>
      </footer>
    </div>
  );
}

export default App;