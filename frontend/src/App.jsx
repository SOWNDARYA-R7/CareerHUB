
import { useEffect, useState } from "react";
import "./index.css";
import CareerGuide from "./CareerGuide";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [learningResources, setLearningResources] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState("");
  const [domain, setDomain] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
const [loadMoreError, setLoadMoreError] = useState("");


const [internships, setInternships] = useState([]);
const [internshipLoading, setInternshipLoading] = useState(false);
const [internshipError, setInternshipError] = useState("");

const [selectedLocations, setSelectedLocations] = useState(["India"]);
const [selectedModes, setSelectedModes] = useState([
  "On-site",
  "Hybrid",
  "Remote",
]);

const internshipLocations = [
  "India",
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Coimbatore",
  "Mumbai",
  "Remote",
  "Worldwide",
];

  // Default images for learning resource types
  const resourceImages = {
    Course: "/resources/course.png",
    Tutorial: "/resources/tutorial.png",
    Documentation: "/resources/documentation.png",
    Video: "/resources/video.png",
    Project: "/resources/project.jpg",
    Article: "/resources/article.png",
  };

  // Resource filter types
  const resourceTypes = [
    "All",
    "Course",
    "Tutorial",
    "Documentation",
    "Video",
    "Project",
    "Article",
  ];

  // Filter learning resources
  const filteredResources =
    activeFilter === "All"
      ? learningResources
      : learningResources.filter(
          (resource) =>
            (resource.resourceType || "Article") === activeFilter
        );

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
  if (!domain.trim() || learningLoading) return;

  setLearningLoading(true);
  setLearningError("");
  setLearningResources([]);
  setActiveFilter("All");
  setPage(1);
  setHasMore(false);

  try {
    const response = await fetch(
      `http://localhost:5000/api/learning?domain=${encodeURIComponent(
        domain.trim()
      )}&page=1`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch learning resources");
    }

    const data = await response.json();

    setLearningResources(data.resources || []);
    setPage(data.page || 1);
    setHasMore(data.hasMore || false);

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


const handleLoadMore = async () => {
  if (loadingMore || !hasMore || !domain.trim()) return;

  const nextPage = page + 1;

  setLoadingMore(true);
  setLoadMoreError("");

  try {
    const response = await fetch(
      `http://localhost:5000/api/learning?domain=${encodeURIComponent(
        domain.trim()
      )}&page=${nextPage}`
    );

    if (!response.ok) {
      throw new Error("Failed to load more resources");
    }

    const data = await response.json();
    const newResources = data.resources || [];

    setLearningResources((previous) => {
      const existingLinks = new Set(previous.map((item) => item.link));
      const uniqueNewResources = newResources.filter(
        (item) => !existingLinks.has(item.link)
      );

      return [...previous, ...uniqueNewResources];
    });

    setPage(data.page || nextPage);
    setHasMore(data.hasMore || false);
  } catch (error) {
    console.error(error);
    setLoadMoreError("Unable to load more resources. Please try again.");
  } finally {
    setLoadingMore(false);
  }
};


const handleInternshipSearch = async () => {
  if (!domain.trim() || selectedLocations.length === 0 || internshipLoading) {
    return;
  }

  setInternshipLoading(true);
  setInternshipError("");
  setInternships([]);

  try {
   const params = new URLSearchParams({
  domain: domain.trim(),
  locations: selectedLocations.join(","),
  workModes: selectedModes.join(","),
});

    const response = await fetch(
      `http://localhost:5000/api/internships?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch internships");
    }

    const data = await response.json();
    setInternships(data.internships || []);

    document.getElementById("internships")?.scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
  console.error("Internship Search Error:", error);
  setInternshipError(
    error.message || "Unable to load internships. Please try again."
  );
} finally {
  setInternshipLoading(false);
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

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR CAREER JOURNEY STARTS HERE
            </p>

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

              <button
                onClick={handleLearningSearch}
                disabled={learningLoading || !domain.trim()}
              >
                {learningLoading ? "Searching..." : "Search"}
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

          {/* Filter Buttons */}
          {!learningLoading &&
            !learningError &&
            learningResources.length > 0 && (
              <div className="resource-filters">
                {resourceTypes.map((type) => {
                  const count =
                    type === "All"
                      ? learningResources.length
                      : learningResources.filter(
                          (resource) =>
                            (resource.resourceType || "Article") === type
                        ).length;

                  return (
                    <button
                      key={type}
                      className={`filter-btn ${
                        activeFilter === type ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter(type)}
                    >
                      {type} ({count})
                    </button>
                  );
                })}
              </div>
            )}

          {/* Loading */}
          {learningLoading && (
            <div className="status">
              <div className="loader"></div>
              <p>Finding learning resources...</p>
            </div>
          )}

          {/* Error */}
          {learningError && (
            <div className="error">
              {learningError}
            </div>
          )}

          {/* Initial Empty State */}
          {!learningLoading &&
            !learningError &&
            learningResources.length === 0 && (
              <div className="learning-empty">
                <p>
                  Search a domain or skill to discover learning resources.
                </p>
              </div>
            )}

          {/* Filtered Resources */}
          {!learningLoading &&
            !learningError &&
            learningResources.length > 0 && (
              <>
                {filteredResources.length > 0 ? (
                  <div className="learning-grid">
                    {filteredResources.map((resource, index) => {
                      const type = resource.resourceType || "Article";
                      const fallbackImage =
                        resourceImages[type] || resourceImages.Article;

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
                              alt={resource.title || type}
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
                              {type}
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
                ) : (
                  <p className="no-resources">
                    No {activeFilter.toLowerCase()} resources found.
                  </p>
                )}
                
                {hasMore && (
                  <div className="load-more-container">
                    <button
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}

                {loadMoreError && (
                  <p className="error">{loadMoreError}</p>
                )}
              </>
            )}
        </section>

        

{/* Internship Section */}
<section className="internship-section" id="internships">
  <div className="section-heading">
    <div>
      <p className="section-label">EXPLORE OPPORTUNITIES</p>
      <h2>Domain Internships</h2>
      <p>
        Find internships based on your domain, preferred locations
        and work modes.
      </p>
    </div>
  </div>

  <div className="internship-search">
    <h3>Preferred Locations</h3>

    <div className="location-options">
      {internshipLocations.map((location) => (
        <label key={location} className="location-option">
          <input
            type="checkbox"
            checked={selectedLocations.includes(location)}
            onChange={(e) => {
              setSelectedLocations((previous) =>
                e.target.checked
                  ? location === "Worldwide"
                    ? ["Worldwide"]
                    : [
                        ...previous.filter(
                          (item) => item !== "Worldwide"
                        ),
                        location,
                      ]
                  : previous.filter((item) => item !== location)
              );
            }}
          />
          {location}
        </label>
      ))}
    </div>

    <h3>Work Mode</h3>

    <div className="location-options">
      {["On-site", "Hybrid", "Remote"].map((mode) => (
        <label key={mode} className="location-option">
          <input
            type="checkbox"
            checked={selectedModes.includes(mode)}
            onChange={(e) => {
              setSelectedModes((previous) =>
                e.target.checked
                  ? [...previous, mode]
                  : previous.filter((item) => item !== mode)
              );
            }}
          />
          {mode}
        </label>
      ))}
    </div>

    <button
      onClick={handleInternshipSearch}
      disabled={
        internshipLoading ||
        !domain.trim() ||
        selectedLocations.length === 0 ||
        selectedModes.length === 0
      }
    >
      {internshipLoading ? "Searching..." : "Find Internships"}
    </button>
  </div>

  {internshipLoading && (
    <div className="status">
      <div className="loader"></div>
      <p>Finding internships...</p>
    </div>
  )}

  {internshipError && (
    <div className="error">{internshipError}</div>
  )}

  {!internshipLoading &&
    !internshipError &&
    internships.length > 0 && (
      <div className="internship-grid">
        {internships.map((item, index) => (
          
<article
  className="internship-card"
  key={item.link || index}
>
  <div className="internship-card-top">
    <span className="internship-tag">Internship</span>
    <icon-placeholder />
  </div>

  <h3>{item.title}</h3>

  <p className="internship-company">
    <span className="meta-icon">▣</span>
    {item.company || "Company not specified"}
  </p>

  <div className="internship-meta">
    <span>
      <span className="meta-icon">⌖</span>
      {item.location || "Location not specified"}
    </span>
    <span>
      <span className="meta-icon">◷</span>
      {item.workMode || "Work mode not specified"}
    </span>
  </div>

  <p className="internship-description">
    {item.description || "View the original listing for more details."}
  </p>

  <div className="internship-card-footer">
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Opportunity <span>↗</span>
    </a>
  </div>
</article>
        ))}
      </div>
    )}

  {!internshipLoading &&
    !internshipError &&
    internships.length === 0 && (
      <p className="learning-empty">
        Enter a domain above, select locations and work modes,
        then find internships.
      </p>
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
                  key={item._id || index}
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
       <CareerGuide />
      </main>

      {/* Footer */}
      <footer>
        <p>CareerHub • Learn → Build → Grow</p>
      </footer>
    </div>
  );
}

export default App;