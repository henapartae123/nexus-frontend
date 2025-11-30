import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../store/api/graphqlApi";
import { selectCurrentUser } from "../store/slices/authSlice";
import "./MeCard.css";

const MeCard = () => {
  const navigate = useNavigate();
  const userFromAuth = useSelector(selectCurrentUser);
  const { data, isLoading, error, refetch } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="me-card loading">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="me-card error">
        <p>Error loading profile</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  const profile = data?.me || userFromAuth;

  console.log(profile);

  if (!profile) {
    return null;
  }

  return (
    <div className="me-card">
      <div className="me-card-header">
        <div className="avatar-container">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {profile.displayName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="profile-info">
          <h3 className="profile-name">{profile.displayName || "User"}</h3>
          <p className="profile-username">@{profile.username || "username"}</p>
        </div>
      </div>

      {profile.bio && (
        <div className="profile-bio">
          <p>{profile.bio}</p>
        </div>
      )}

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-value">{profile.followerCount || 0}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-value">{profile.followingCount || 0}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <div className="profile-actions">
        <Link to={`/profile/${profile.id}`} className="btn-view-profile">
          View Profile
        </Link>
        <Link to="/settings" className="btn-edit-profile">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default MeCard;
