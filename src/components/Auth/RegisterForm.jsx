import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../store/api/graphqlApi";
import { setCredentials } from "../../store/slices/authSlice";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const result = await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      }).unwrap();

      console.log("Register result:", result); // Debug log

      // Auto-login after registration with tokens from createUser
      dispatch(
        setCredentials({
          token: result.token,
          refreshToken: result.refreshToken,
          user: result.user,
        })
      );

      navigate("/feed");
    } catch (err) {
      console.error("Registration error:", err);

      // Handle different error formats
      const errorMessage =
        err?.data?.errors?.[0]?.message ||
        err?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);
    }
  };

  return (
    <div className="p-10">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}

      <form className="w-1/2" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name *</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            minLength="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            minLength="8"
          />
          <small>At least 8 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            minLength="8"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p>
        Don't have an Account? <Link to="/login">LogIn</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
