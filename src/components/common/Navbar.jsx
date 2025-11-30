import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";
import { useGetAllPostsQuery } from "../../store/api/graphqlApi";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const { data: postsData } = useGetAllPostsQuery();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (postsData?.allPosts) {
      const query = searchQuery.toLowerCase();

      // Search in posts and users
      const results = postsData.allPosts
        .filter(
          (post) =>
            post.content.toLowerCase().includes(query) ||
            post.author.displayName.toLowerCase().includes(query)
        )
        .slice(0, 5); // Limit to 5 results

      setSearchResults(results);
      setShowDropdown(results.length > 0);
    }
  }, [searchQuery, postsData]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handleResultClick = (postId) => {
    navigate(`/post/${postId}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  console.log(user);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/feed" className="navbar-logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">SociaCore</span>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search posts and users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              <div className="search-results-header">Search Results</div>
              {searchResults.map((post) => (
                <div
                  key={post.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(post.id)}
                >
                  <div className="result-author">
                    {post.author.avatarUrl && (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.displayName}
                      />
                    )}
                    <span>{post.author.displayName}</span>
                  </div>
                  <div className="result-content">
                    {post.content.substring(0, 80)}
                    {post.content.length > 80 && "..."}
                  </div>
                  <div className="result-stats">
                    ❤️ {post.likeCount} · 💬 {post.commentCount}
                  </div>
                </div>
              ))}
              <div className="search-results-footer">
                <button onClick={handleSearchSubmit} className="view-all-btn">
                  View all results for "{searchQuery}"
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/feed" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Feed</span>
          </Link>
          <Link to="/posts" className="nav-link">
            <span className="nav-icon">📝</span>
            <span className="nav-text">Posts</span>
          </Link>
          <Link to="/trending" className="nav-link">
            <span className="nav-icon">🔥</span>
            <span className="nav-text">Trending</span>
          </Link>
          <Link to="/notifications" className="nav-link">
            <span className="nav-icon">🔔</span>
            <span className="nav-text">Notifications</span>
          </Link>
        </div>

        {/* User Menu */}
        <div className="navbar-user" ref={userMenuRef}>
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                {user?.displayName?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <span className="user-name">{user?.displayName || "User"}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="user-dropdown">
              <Link
                to={`/profile/${user?.username}`}
                className="dropdown-item"
                onClick={() => setShowUserMenu(false)}
              >
                <span className="dropdown-icon">👤</span>
                Profile
              </Link>
              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() => setShowUserMenu(false)}
              >
                <span className="dropdown-icon">⚙️</span>
                Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button
                onClick={handleLogout}
                className="dropdown-item logout-btn"
              >
                <span className="dropdown-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
