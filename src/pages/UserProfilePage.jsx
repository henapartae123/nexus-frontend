import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProfileByUsernameQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../store/api/graphqlApi";
import { selectCurrentUser } from "../store/slices/authSlice";
import "./UserProfilePage.css";
import Postcard from "../components/Postcard";

const UserProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts', 'replies', 'media'

  const { data, isLoading, error, refetch } =
    useGetProfileByUsernameQuery(username);
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowLoading }] =
    useUnfollowUserMutation();

  const profile = data?.profileByUsername;
  const isOwnProfile = currentUser?.id === profile?.id;

  useEffect(() => {
    // In a real app, you'd check if current user follows this profile
    // For now, we'll assume not following
    setIsFollowing(false);
  }, [profile]);

  const handleFollowToggle = async () => {
    if (!profile?.id) return;

    try {
      if (isFollowing) {
        await unfollowUser(profile.id).unwrap();
        setIsFollowing(false);
      } else {
        await followUser(profile.id).unwrap();
        setIsFollowing(true);
      }
      refetch();
    } catch (err) {
      console.error("Error toggling follow:", err);
      alert("Failed to update follow status");
    }
  };

  if (isLoading) {
    return (
      <div className="user-profile-page loading">
        <div className="profile-skeleton">
          <div className="skeleton-banner"></div>
          <div className="skeleton-avatar"></div>
          <div className="skeleton-info"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="user-profile-page error">
        <div className="error-container">
          <h2>Profile Not Found</h2>
          <p>The user @{username} doesn't exist or has been deleted.</p>
          <button onClick={() => navigate("/feed")} className="btn-back">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-banner">
          {/* You can add a banner image here */}
        </div>

        <div className="profile-main">
          <div className="profile-avatar-section">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="profile-avatar-large"
              />
            ) : (
              <div className="profile-avatar-large-placeholder">
                {profile.displayName?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>

          <div className="profile-actions-section">
            {isOwnProfile ? (
              <button
                className="btn-edit-profile"
                onClick={() => navigate("/settings")}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className={`btn-follow ${isFollowing ? "following" : ""}`}
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading || isUnfollowLoading}
                >
                  {isFollowLoading || isUnfollowLoading
                    ? "Loading..."
                    : isFollowing
                    ? "Following"
                    : "Follow"}
                </button>
                <button className="btn-message">Message</button>
              </>
            )}
          </div>
        </div>

        <div className="profile-info-section">
          <h1 className="profile-name">{profile.displayName}</h1>
          <p className="profile-username">@{username}</p>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{profile.followingCount || 0}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.followerCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`tab ${activeTab === "replies" ? "active" : ""}`}
          onClick={() => setActiveTab("replies")}
        >
          Replies
        </button>
        <button
          className={`tab ${activeTab === "media" ? "active" : ""}`}
          onClick={() => setActiveTab("media")}
        >
          Media
        </button>
      </div>

      {/* Posts Section */}
      <div className="profile-content">
        {activeTab === "posts" && (
          <div className="posts-list">
            {profile.posts && profile.posts.length > 0 ? (
              profile.posts.map((post) => (
                <Postcard key={post.id} post={post} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No posts yet</h3>
                <p>
                  {isOwnProfile
                    ? "You haven't posted anything yet."
                    : `@${username} hasn't posted anything yet.`}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "replies" && (
          <div className="empty-state">
            <p>Replies feature coming soon!</p>
          </div>
        )}

        {activeTab === "media" && (
          <div className="empty-state">
            <p>Media feature coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
