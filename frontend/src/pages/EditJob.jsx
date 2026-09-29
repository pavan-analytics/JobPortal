import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./EditJob.css";

function EditJob() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(
          `/jobs/${id}/`
        );

        const job = response.data;

        setFormData({
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          type: job.type,
          experience: job.experience,
          skills: job.skills,
          description: job.description,
        });
      } catch (error) {
        console.error(
          "Error fetching job:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else if (error.response?.status === 403) {
          setError(
            "Only recruiters can edit jobs."
          );
        } else if (error.response?.status === 404) {
          setError(
            "Job not found or you do not own this job."
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
      const response = await api.put(
        `/jobs/${id}/`,
        formData
      );

      console.log(
        "Updated job:",
        response.data
      );

      setSuccess(
        "Job updated successfully!"
      );

      setTimeout(() => {
        navigate("/manage-jobs");
      }, 1000);
    } catch (error) {
      console.error(
        "Error updating job:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "Only recruiters can edit jobs."
        );
      } else if (error.response?.status === 404) {
        setError(
          "Job not found or you do not own this job."
        );
      } else if (error.response?.status === 401) {
        setError(
          "Your login session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to update job."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="edit-job-page">
        <h1>Edit Job</h1>
        <p>Loading job...</p>
      </div>
    );
  }

  return (
    <div className="edit-job-page">
      <div className="edit-job-card">
        <h1>Edit Job</h1>

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
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;