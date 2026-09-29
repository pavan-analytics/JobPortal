import { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="home">

      <section className="hero">

        <h1>Find Your Dream Job</h1>

        <p>
          Discover thousands of jobs and build your career.
        </p>

        <div className="search-box">

          <input
            type="text"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={() => {
              navigate(
                `/jobs?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`
              );
            }}
          >
            Search Jobs
          </button>
        </div>

      </section>

    </div>
  );
}

export default Home;