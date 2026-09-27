function App() {
  return (
    <div>
      <header>
        <h1>Career Discovery</h1>
        <p>Learn • Explore • Discover Opportunities</p>
      </header>

      <main>
        <section>
          <h2>Search Your Domain</h2>

          <input
            type="text"
            placeholder="Eg: Cybersecurity, AI/ML, Web Development"
          />

          <button>Search</button>
        </section>

        <section>
          <h2>Latest Technology & Career News</h2>

          <div>
            <h3>News will appear here</h3>
            <p>
              Latest technology and career-related news will be
              displayed here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;