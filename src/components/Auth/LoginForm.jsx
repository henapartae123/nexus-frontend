import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/api/graphqlApi";
import {
  setCredentials,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ username, password }).unwrap();

      console.log("Login result:", result); // Debug log

      // The transformResponse already extracted the values
      // So we use result.token NOT result.tokenAuth.token
      dispatch(
        setCredentials({
          token: result.token,
          refreshToken: result.refreshToken,
          user: result.user,
        })
      );

      navigate("/feed");
    } catch (err) {
      console.error("Login error:", err);

      // Handle different error formats
      const errorMessage =
        err?.data?.errors?.[0]?.message ||
        err?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";

      setError(errorMessage);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl">Login</h2>
      {error && <div className="error-message">Check your credentials</div>}

      <form className="w-1/2" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an Account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginForm;
