import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProfile: null,
  followers: [],
  following: [],
  userPosts: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
      state.loading = false;
    },

    updateProfile: (state, action) => {
      state.currentProfile = { ...state.currentProfile, ...action.payload };
    },

    setFollowers: (state, action) => {
      state.followers = action.payload;
    },

    setFollowing: (state, action) => {
      state.following = action.payload;
    },

    addFollower: (state, action) => {
      state.followers.push(action.payload);
      if (state.currentProfile) {
        state.currentProfile.followerCount += 1;
      }
    },

    removeFollower: (state, action) => {
      state.followers = state.followers.filter((f) => f.id !== action.payload);
      if (state.currentProfile) {
        state.currentProfile.followerCount -= 1;
      }
    },

    addFollowing: (state, action) => {
      state.following.push(action.payload);
      if (state.currentProfile) {
        state.currentProfile.followingCount += 1;
      }
    },

    removeFollowing: (state, action) => {
      state.following = state.following.filter((f) => f.id !== action.payload);
      if (state.currentProfile) {
        state.currentProfile.followingCount -= 1;
      }
    },

    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },

    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },

    setProfileError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentProfile,
  updateProfile,
  setFollowers,
  setFollowing,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
  setUserPosts,
  setProfileLoading,
  setProfileError,
} = profileSlice.actions;

export default profileSlice.reducer;
