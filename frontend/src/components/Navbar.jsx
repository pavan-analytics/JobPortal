import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser =
      localStorage.getItem("loggedInUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    setLoggedInUser(null);

    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        JobPortal
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/jobs">Jobs</Link>

        {loggedInUser ? (
          <>
            {loggedInUser.role === "candidate" ? (
              <>
                <Link to="/candidate-dashboard">
                  Dashboard
                </Link>

                <Link to="/profile">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/recruiter-dashboard">
                  Dashboard
                </Link>

                <Link to="/post-job">
                  Post Job
                </Link>

                <Link to="/manage-jobs">
                  Manage Jobs
                </Link>
              </>
            )}

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;