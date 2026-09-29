import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get(
          "/applications/"
        );

        setApplications(response.data);

      } catch (error) {
        console.error(
          "Error fetching applications:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else if (error.response?.status === 403) {
          setError(
            "Only candidates can view applications."
          );
        } else {
          setError(
            "Unable to load applications."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="dashboard">
      <h1>Candidate Dashboard</h1>

      <p>Welcome to your dashboard!</p>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h2>Browse Jobs</h2>

          <p>
            Find jobs that match your skills.
          </p>

          <Link to="/jobs">
            Browse Jobs
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>My Applications</h2>

          {loading ? (
            <p>
              Loading applications...
            </p>
          ) : error ? (
            <p className="error">
              {error}
            </p>
          ) : applications.length > 0 ? (
            <div className="applications-list">

              {applications.map((application) => {
                const status =
                  application.status ||
                  "Applied";

                return (
                  <div
                    className="application-item"
                    key={application.id}
                  >
                    <h3>
                      {application.job_title}
                    </h3>

                    <p>
                      {application.company}
                    </p>

                    <p>
                      Status:

                      <span
                        className={`status-badge ${status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </p>

                    <p>
                      Applied on:{" "}
                      {new Date(
                        application.applied_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}

            </div>
          ) : (
            <p>
              You haven't applied for any jobs yet.
            </p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>My Profile</h2>

          <p>
            View and update your profile.
          </p>

          <Link to="/profile">
            Edit Profile
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CandidateDashboard;