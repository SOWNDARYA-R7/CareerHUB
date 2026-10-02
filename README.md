## CareerHub 🚀
# Learn • Explore • Build Your Career
CareerHub is a career discovery platform that brings technology and
career news, domain-based learning resources, and internship
opportunities together in one place.
Users can explore learning materials by domain, filter resources by
type, and search for internships using preferred locations and work
modes.

## ✨ Features
> 📰 Technology & Career News
Fetches technology and career-related news using SerpApi (Google
News engine).
Displays news headlines, sources, dates, and thumbnails when
available.
Stores fetched news in MongoDB and serves cached news for up to 24
hours to reduce repeated API calls.
> 📚 Domain-Based Learning Resources
Search learning resources using a domain or skill.
Fetches results through SerpApi's Google Search engine.
Classifies resources into:
Course
Tutorial
Documentation
Video
Project
Article
Filter results by resource type.
Supports pagination with 10 results per page and a Load More
option.
Caches results by domain and page for up to 24 hours.
Avoids showing duplicate links when loading additional results in
the frontend.
> 💼 Domain Internship Search
Search for internships related to a domain or skill.
Select multiple preferred locations, such as India, Chennai,
Bengaluru, Hyderabad, Coimbatore, Mumbai, Remote, and Worldwide.
Select work-mode preferences: On-site, Hybrid, and Remote.
Fetches search results through SerpApi.
Removes duplicate results based on their links.
Caches results using the domain, selected locations, and work modes
for up to 24 hours.
Provides links to original listings so users can review the
opportunity details.
> Internship results are sourced from search results. Location, work
> mode, company, eligibility, and availability may not always be
> explicitly verified by the returned data. Check the original listing
> for current and accurate details.
> 🎨 User Interface
React + Vite frontend.
Light theme with blue accents.
Responsive layouts for news, learning resources, and internship
results.
Loading, empty, and error states for search sections.
>🧰 Tech Stack
Area                              Technology
---
Frontend                          React
Development server / build tool   Vite
Styling                           CSS
Backend                           Node.js, Express
Database                          MongoDB
ODM                               Mongoose
Search and news data              SerpApi
Frontend requests                 Fetch API
Cross-origin requests             CORS
> 🗂️ Project Structure
The structure below shows the main files used by the current
implementation. Your local folder may contain additional files.
``` text
CareerHub/
├── client/                     # React + Vite frontend
│   ├── public/
│   │   └── resources/           # Learning resource fallback images
│   └── src/
│       ├── App.jsx              # Main UI and search interactions
│       └── index.css            # Application styles
│
└── server/                     # Express backend
    ├── models/
    │   ├── News.js
    │   ├── LearningResource.js
    │   └── Internship.js
    ├── server.js                # API routes and server setup
    └── .env                     # Local environment variables (not committed)
```
> ⚙️ Requirements
Install the following before running the project: - Node.js and npm -
MongoDB (local instance or a MongoDB deployment) - A SerpApi API key

> 🚀 Getting Started
1. Clone the repository
``` bash
git clone <your-repository-url>
cd CareerHub
```
2. Install frontend dependencies
``` bash
cd frontend
npm install
```
Start the frontend development server:
``` bash
npm run dev
```
3. Install backend dependencies
Open another terminal:
``` bash
cd server
npm install
```
The backend uses these packages:
``` bash
npm install express cors mongoose serpapi dotenv
```
For automatic restarts during development, you can optionally install:
``` bash
npm install --save-dev nodemon
```
4. Configure environment variables
Create a `.env` file inside the backend folder:
``` env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerhub
SERPAPI_KEY=your_serpapi_api_key
```
Replace `your_serpapi_api_key` with your own key. Use your actual
MongoDB connection string if it differs from the example.
Security: Never commit `.env` or expose your SerpApi key in frontend
code or public repositories. Add `.env` to `.gitignore`.

5. Start the backend
From the backend folder, run:
``` bash
node server.js
```
If using nodemon:
``` bash
npx nodemon server.js
```
The backend runs at:
``` text
http://localhost:5000
```
The frontend and backend should both be running during local
development.

> 🔌 API Endpoints
Home
``` http
GET /
```
Returns a message confirming that the backend is running.

> News
``` http
GET /api/news
```
Fetches technology and career news, using MongoDB cache when valid
cached news exists.

> Learning resources
``` http
GET /api/learning?domain=python&page=1
```
Query parameter   Required   Description
---
`domain`          Yes        Domain or skill to search
`page`            No         Positive page number; defaults to `1`
Returns learning resources, page information, and `hasMore`. Results are
cached by domain and page for up to 24 hours.

> Internships
``` http
GET /api/internships?domain=python&locations=India,Chennai&workModes=hybrid,remote
```
---
Query parameter         Required                Description
---
`domain`                Yes                     Domain or skill
`locations`             Yes                     One or more
comma-separated
preferred locations

`workModes`             No                      Comma-separated modes:
`on-site`, `hybrid`,
`remote`
Returns internship search results and whether they came from SerpApi or
MongoDB cache. Cache entries are keyed by domain, locations, and work
modes and are intended to remain valid for 24 hours.

> 🗃️ Caching
CareerHub uses MongoDB to reduce repeated external search requests: -
News results are cached for up to 24 hours. - Learning resources are
cached per domain and page for up to 24 hours. - Internship results are
cached per domain, selected locations, and selected work modes for up to
24 hours. - Expired cache entries are not intended to be served. MongoDB
TTL cleanup runs in the background, so physical deletion may happen
later than the expiry time.
Caching reduces repeated SerpApi requests, but new or different searches
may still use API quota.

> 🔐 Security and Usage Notes
Keep API keys and database credentials in backend environment
variables.
Do not place secrets in React code.
Validate and limit API requests before deploying publicly.
Monitor SerpApi usage and configure provider-side billing or usage
limits to avoid unexpected charges.
Review third-party internship listings at their original source
before relying on details.

> 🛣️ Future Enhancements
The following are planned and are not yet implemented: - User
registration and login. - User accounts with two free search credits. -
Tracking search usage per account. - Subscription plans and payment
integration. - Credit top-ups and subscription-based search
allowances. - Admin dashboard for monitoring user activity and API
usage. - Server-side API quota and spending controls.

>📌 Current Project Status
Implemented: - News fetching and 24-hour MongoDB caching. - Domain-based
learning resource search, filtering, pagination, and caching. -
Domain-based internship search with multiple location and work-mode
preferences. - Internship result deduplication and caching. - React
interface for news, learning resources, and internships.
Planned: - Authentication, user-specific credits, subscriptions, and
payments.
