import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/");

        setJobs(response.data);
      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else {
          setError(
            "Unable to load jobs. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      job.company
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      job.skills
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesLocation =
      location === "" ||
      job.location
        .toLowerCase()
        .includes(location.toLowerCase());

    const matchesType =
      jobType === "" ||
      job.type === jobType;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType
    );
  });

  if (loading) {
    return (
      <div className="jobs-page">
        <h1>Available Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-page">
        <h1>Available Jobs</h1>
        <p className="error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <h1>Available Jobs</h1>

      <div className="job-filters">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <select
          value={jobType}
          onChange={(e) =>
            setJobType(e.target.value)
          }
        >
          <option value="">
            All Types
          </option>

          <option value="Full Time">
            Full Time
          </option>

          <option value="Part Time">
            Part Time
          </option>

          <option value="Internship">
            Internship
          </option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
            >
              <h2>{job.title}</h2>

              <h3>{job.company}</h3>

              <p>
                📍 {job.location}
              </p>

              <p>
                💰 {job.salary}
              </p>

              <p>
                💼 {job.type}
              </p>

              <p>
                🧑‍💻 {job.experience}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {job.skills}
              </p>

              <Link
                to={`/jobs/${job.id}`}
                className="view-job-button"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;