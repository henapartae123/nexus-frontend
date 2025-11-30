import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProfileByUsernameQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../store/api/graphqlApi";
import { setCurrentProfile } from "../store/slices/profileSlice";
import Postcard from "../components/Postcard";

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetProfileByUsernameQuery(username);
  const currentUser = useSelector((state) => state.auth.user);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    if (data?.profileByUsername) {
      dispatch(setCurrentProfile(data.profileByUsername));
    }
  }, [data, dispatch]);

  if (isLoading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">Error loading profile</div>;
  if (!data?.profileByUsername) return <div>Profile not found</div>;

  const profile = data.profileByUsername;
  const isOwnProfile = currentUser?.id === profile.id;

  const handleFollow = async () => {
    try {
      await followUser(profile.id).unwrap();
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(profile.id).unwrap();
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="profile-avatar"
          />
        )}

        <div className="profile-info">
          <h1>{profile.displayName}</h1>
          <p className="bio">{profile.bio}</p>

          <div className="profile-stats">
            <span>{profile.followerCount} Followers</span>
            <span>{profile.followingCount} Following</span>
          </div>

          {!isOwnProfile && (
            <div className="profile-actions">
              <button onClick={handleFollow}>Follow</button>
              <button onClick={handleUnfollow}>Unfollow</button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>
        {profile.posts && profile.posts.length > 0 ? (
          profile.posts.map((post) => <Postcard key={post.id} post={post} />)
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
