import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./PostJob.css";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    experience: "",
    skills: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        "/jobs/",
        formData
      );

      console.log(
        "Job created:",
        response.data
      );

      setSuccess(
        "Job posted successfully!"
      );

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "Full Time",
        experience: "",
        skills: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/manage-jobs");
      }, 1000);

    } catch (error) {
      console.error(
        "Error posting job:",
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
          "Only recruiters can post jobs."
        );
      } else {
        setError(
          "Unable to post job. Please check your details."
        );
      }
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-card">
        <h1>Post a Job</h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {success && (
          <p className="success">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Job Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Company</label>

          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Salary</label>

          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          <label>Job Type</label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
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

          <label>Experience</label>

          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />

          <label>Skills</label>

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Python, SQL, Django..."
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          />

          <button type="submit">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;