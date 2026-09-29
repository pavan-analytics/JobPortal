import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./ManageJobs.css";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await api.get("/my-jobs/");

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
      } else if (error.response?.status === 403) {
        setError(
          "Only recruiters can access their jobs."
        );
      } else {
        setError(
          "Unable to load jobs."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/jobs/${jobId}/`
      );

      alert(
        "Job deleted successfully!"
      );

      await fetchJobs();

    } catch (error) {
      console.error(
        "Delete job error:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Your login session has expired. Please login again."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Only recruiters can delete jobs."
        );
      } else if (error.response?.status === 404) {
        alert(
          "Job not found or you do not own this job."
        );
      } else {
        alert(
          "Unable to delete job."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="manage-jobs-page">
        <h1>Manage Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="manage-jobs-page">
        <h1>Manage Jobs</h1>
        <p className="error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="manage-jobs-page">
      <h1>Manage Jobs</h1>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="manage-jobs-list">
          {jobs.map((job) => (
            <div
              className="manage-job-card"
              key={job.id}
            >
              <div className="job-info">
                <h2>{job.title}</h2>

                <p>
                  <strong>Company:</strong>{" "}
                  {job.company}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {job.location}
                </p>

                <p>
                  <strong>Type:</strong>{" "}
                  {job.type}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {job.experience}
                </p>
              </div>

              <div className="job-actions">
                <Link
                  to={`/jobs/${job.id}`}
                  className="view-button"
                >
                  View
                </Link>

                <Link
                  to={`/edit-job/${job.id}`}
                  className="edit-button"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageJobs;