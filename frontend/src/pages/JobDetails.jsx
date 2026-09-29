import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(
          `/jobs/${id}/`
        );

        setJob(response.data);

      } catch (error) {
        console.error(
          "Error fetching job:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Please login to view job details."
          );
        } else if (
          error.response?.status === 404
        ) {
          setError(
            "The job you're looking for does not exist."
          );
        } else {
          setError(
            "Unable to load job details."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      const response = await api.post(
        "/applications/",
        {
          job: job.id,
        }
      );

      console.log(
        "Application submitted:",
        response.data
      );

      alert(
        "Application submitted successfully!"
      );

    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      if (error.response?.status === 400) {
        alert(
          error.response.data.detail ||
          "You have already applied for this job."
        );
      } else if (
        error.response?.status === 403
      ) {
        alert(
          "Only candidates can apply for jobs."
        );
      } else if (
        error.response?.status === 404
      ) {
        alert("Job not found.");
      } else if (
        error.response?.status === 401
      ) {
        alert(
          "Your login session has expired. Please login again."
        );
      } else {
        alert(
          "Unable to apply for this job."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="job-details">
        <h1>Loading Job...</h1>
        <p>
          Please wait while we load the job details.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details">
        <h1>Job Not Found</h1>

        <p>{error}</p>

        <Link
          to="/jobs"
          className="back-link"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="job-details">
      <Link
        to="/jobs"
        className="back-link"
      >
        ← Back to Jobs
      </Link>

      <h1>{job.title}</h1>

      <h2>{job.company}</h2>

      <div className="job-info">
        <p>📍 {job.location}</p>
        <p>💰 {job.salary}</p>
        <p>💼 {job.type}</p>
        <p>🧑‍💻 {job.experience}</p>
      </div>

      <h3>Job Description</h3>

      <p>{job.description}</p>

      <h3>Required Skills</h3>

      <div className="skills">
        {job.skills
          .split(",")
          .map((skill) => (
            <span key={skill.trim()}>
              {skill.trim()}
            </span>
          ))}
      </div>

      <button
        className="apply-button"
        onClick={handleApply}
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobDetails;