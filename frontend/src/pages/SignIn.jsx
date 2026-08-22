import React, { useState } from "react";
import { loginUser } from "../services/authService";
import "./SignIn.css";

export default function SignIn({ onSignInSuccess, onNavigateToSignUp }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginId.trim()) {
      setError("Please enter your Login ID or Email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await loginUser({ loginId: loginId.trim(), password });
      if (onSignInSuccess) {
        onSignInSuccess(user);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left Section — Person 2 Hero Design */}
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

      {/* Right Section — Person 2 Card Form */}
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
              <label>Login ID / Email Address</label>

              <input
                type="text"
                placeholder="e.g. DFADUS20260001 or admin@dayflow.com"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                onClick={() => alert("Please contact your administrator to reset your password.")}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?
            <button type="button" onClick={onNavigateToSignUp}>
              Sign up
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}
