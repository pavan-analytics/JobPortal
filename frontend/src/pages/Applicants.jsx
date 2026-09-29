import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Applicants.css";

function Applicants() {
  const [selectedJob, setSelectedJob] = useState("All");
  const [applications, setApplications] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse =
          await api.get(
            "/recruiter-applications/"
          );

        const jobsResponse =
          await api.get(
            "/my-jobs/"
          );

        setApplications(
          applicationsResponse.data
        );

        setRecruiterJobs(
          jobsResponse.data
        );

      } catch (error) {
        console.error(
          "Error fetching applicants:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else if (
          error.response?.status === 403
        ) {
          setError(
            "Only recruiters can view applicants."
          );
        } else {
          setError(
            "Unable to load applicants."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    try {
      const response = await api.put(
        `/applications/${applicationId}/`,
        {
          status: newStatus,
        }
      );

      setApplications(
        (currentApplications) =>
          currentApplications.map(
            (application) =>
              application.id === applicationId
                ? response.data
                : application
          )
      );

    } catch (error) {
      console.error(
        "Error updating application status:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to update application status."
      );
    }
  };

  const filteredApplications =
    applications.filter((application) => {
      return (
        selectedJob === "All" ||
        application.job === Number(selectedJob)
      );
    });

  if (loading) {
    return (
      <div className="applicants-page">
        <h1>Applicants</h1>
        <p>Loading applicants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applicants-page">
        <h1>Applicants</h1>
        <p className="error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="applicants-page">
      <h1>Applicants</h1>

      <div className="applicant-filter">
        <label>
          Filter by Job:
        </label>

        <select
          value={selectedJob}
          onChange={(e) =>
            setSelectedJob(e.target.value)
          }
        >
          <option value="All">
            All Jobs
          </option>

          {recruiterJobs.map((job) => (
            <option
              key={job.id}
              value={job.id}
            >
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <p className="no-applicants">
          No applicants found.
        </p>
      ) : (
        <div className="applicants-list">

          {filteredApplications.map(
            (application) => {

              const job =
                recruiterJobs.find(
                  (item) =>
                    item.id === application.job
                );

              return (
                <div
                  className="applicant-card"
                  key={application.id}
                >
                  <h2>
                    {application.job_title}
                  </h2>

                  <p>
                    <strong>
                      Candidate Email:
                    </strong>{" "}
                    {application.candidate_email}
                  </p>

                  <p>
                    <strong>
                      Company:
                    </strong>{" "}
                    {application.company}
                  </p>

                  {job && (
                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {job.location}
                    </p>
                  )}

                  <p>
                    <strong>
                      Applied On:
                    </strong>{" "}
                    {new Date(
                      application.applied_at
                    ).toLocaleDateString()}
                  </p>

                  <label>
                    <strong>
                      Status:
                    </strong>
                  </label>

                  <select
                    value={
                      application.status ||
                      "Applied"
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        application.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Under Review">
                      Under Review
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                    <option value="Selected">
                      Selected
                    </option>
                  </select>
                </div>
              );
            }
          )}

        </div>
      )}
    </div>
  );
}

export default Applicants;