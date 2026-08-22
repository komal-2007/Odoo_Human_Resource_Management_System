import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");

    // Temporary frontend login
    // API authentication will be connected later.
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      {/* Left Section */}
      <div className="login-left">

        <div className="brand">
          <div className="brand-icon">D</div>
          <span>DayFlow</span>
        </div>

        <div className="welcome-content">
          <h1>
            Manage your workday,
            <span> effortlessly.</span>
          </h1>

          <p>
            A simple and smarter way to manage attendance,
            leave, payroll and employee information.
          </p>
        </div>

        <div className="login-footer">
          © 2026 DayFlow
        </div>

      </div>

      {/* Right Section */}
      <div className="login-right">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-icon">D</div>
            <span>DayFlow</span>
          </div>

          <h2>Welcome back</h2>

          <p className="login-subtitle">
            Sign in to your employee account
          </p>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button type="submit" className="login-button">
              Sign In
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?
            <button type="button">
              Contact HR
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;