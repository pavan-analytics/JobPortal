import { Link } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job }) {
  return (
    <div className="job-card">

      <h3>{job.title}</h3>

      <p>{job.company}</p>

      <p>{job.location}</p>

      <p>{job.salary}</p>

      <p>{job.type}</p>

      <Link to={`/jobs/${job.id}`} className="view-button">
        View Job
      </Link>

    </div>
  );
}

export default JobCard;