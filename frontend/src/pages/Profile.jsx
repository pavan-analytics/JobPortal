import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Profile.css";

function Profile() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          "/profile/"
        );

        const profile = response.data;

        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setSkills(profile.skills || "");
        setExperience(profile.experience || "");
        setLocation(profile.location || "");

      } catch (error) {
        console.error(
          "Error fetching profile:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else if (error.response?.status === 403) {
          setError(
            "Only candidates can access this profile."
          );
        } else {
          setError(
            "Unable to load profile."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await api.put(
        "/profile/",
        {
          phone,
          skills,
          experience,
          location,
        }
      );

      alert(
        "Profile saved successfully!"
      );

    } catch (error) {
      console.error(
        "Error updating profile:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Your login session has expired. Please login again."
        );
      } else if (error.response?.status === 403) {
        setError(
          "Only candidates can update this profile."
        );
      } else {
        setError(
          "Unable to save profile."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>My Profile</h1>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            readOnly
          />

          <label>Phone</label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <label>Skills</label>

          <input
            type="text"
            placeholder="Python, SQL, React..."
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
          />

          <label>Experience</label>

          <input
            type="text"
            placeholder="Fresher / 1 Year / 2 Years..."
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
          />

          <label>Location</label>

          <input
            type="text"
            placeholder="Hyderabad"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          <button type="submit">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;