import { Link } from "react-router-dom";
import "./Dashboard.css";

function RecruiterDashboard() {
  return (
    <div className="dashboard">
      <h1>Recruiter Dashboard</h1>

      <p>
        Manage your jobs and applicants from here.
      </p>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h2>Post a Job</h2>

          <p>
            Create a new job posting.
          </p>

          <Link to="/post-job">
            Post Job
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Manage Jobs</h2>

          <p>
            View, edit and delete your job postings.
          </p>

          <Link to="/manage-jobs">
            Manage Jobs
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Applicants</h2>

          <p>
            View candidates who applied to your jobs.
          </p>

          <Link to="/applicants">
            View Applicants
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RecruiterDashboard;