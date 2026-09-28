import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [learningResources, setLearningResources] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState("");
  const [domain, setDomain] = useState("");

  // Default images for learning resource types
  const resourceImages = {
    Course: "/resources/course.png",
    Tutorial: "/resources/tutorial.png",
    Documentation: "/resources/documentation.png",
    Video: "/resources/video.png",
    Project: "/resources/project.jpg",
    Article: "/resources/article.png",
  };

  // Fetch news
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

  // Search learning resources
  const handleLearningSearch = async () => {
    if (!domain.trim()) return;

    setLearningLoading(true);
    setLearningError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/learning?domain=${encodeURIComponent(
          domain.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch learning resources");
      }

      const data = await response.json();

      setLearningResources(data.resources || []);

      // Move to learning section after search
      document.getElementById("learning")?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
      setLearningError("Unable to load learning resources");
    } finally {
      setLearningLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">◆</span>
          <span>
            Career<span>Hub</span>
          </span>
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

            {/* Main Search */}
            <div className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search a domain or skill..."
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLearningSearch();
                  }
                }}
              />

              <button onClick={handleLearningSearch}>
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Learning Resources */}
        <section className="learning-section" id="learning">
          <div className="section-heading">
            <div>
              <p className="section-label">LEARN & GROW</p>
              <h2>Learning Resources</h2>
            </div>
          </div>

          {learningLoading && (
            <div className="status">
              <div className="loader"></div>
              <p>Finding learning resources...</p>
            </div>
          )}

          {learningError && (
            <div className="error">
              {learningError}
            </div>
          )}

          {!learningLoading &&
            !learningError &&
            learningResources.length === 0 && (
              <div className="learning-empty">
                <p>
                  Search a domain or skill to discover learning resources.
                </p>
              </div>
            )}

          {!learningLoading &&
            !learningError &&
            learningResources.length > 0 && (
              <div className="learning-grid">
                {learningResources.map((resource, index) => {
                  const fallbackImage =
                    resourceImages[resource.resourceType] ||
                    resourceImages.Article;

                  return (
                    <a
                      key={resource._id || index}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="learning-card"
                    >
                      {/* Resource Image */}
                      <div className="learning-image-wrapper">
                        <img
                          src={resource.thumbnail || fallbackImage}
                          alt={resource.title}
                          className="learning-image"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                      </div>

                      {/* Resource Content */}
                      <div className="learning-content">
                        <span className="resource-type">
                          {resource.resourceType || "Article"}
                        </span>

                        <h3>{resource.title}</h3>

                        {resource.source && (
                          <p>{resource.source}</p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
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

        {/* Future Internship Section */}
        <section className="coming-section" id="internships">
          <p className="section-label">COMING NEXT</p>

          <h2>Domain Internships</h2>

          <p>
            Discover internship opportunities related to your
            skills and career interests.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>CareerHub • Learn → Build → Grow</p>
      </footer>
    </div>
  );
}

export default App;