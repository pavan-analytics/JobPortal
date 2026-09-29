import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (email.trim() === "") {
      setError("Email is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    try {
      // Step 1: Get JWT tokens
      const tokenResponse = await axios.post(
        `${API_URL}/token/`,
        {
          username: email,
          password: password,
        }
      );

      const accessToken = tokenResponse.data.access;
      const refreshToken = tokenResponse.data.refresh;

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "refreshToken",
        refreshToken
      );

      // Step 2: Get the real user information from Django
      const userResponse = await axios.get(
        `${API_URL}/me/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const user = userResponse.data;

      console.log("Logged in user:", user);

      // Step 3: Save backend user information
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );

      // Step 4: Redirect based on Django role
      if (user.role === "candidate") {
        navigate("/candidate-dashboard");
      } else if (user.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        setError("Invalid user role.");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError("Invalid email or password.");
      } else {
        setError(
          "Unable to connect to the server. Make sure Django is running."
        );
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;