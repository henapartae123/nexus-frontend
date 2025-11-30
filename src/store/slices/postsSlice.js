import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  currentPost: null,
  feed: [],
  trendingPosts: [],
  loading: false,
  error: null,
  hasMore: true,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },

    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    updatePost: (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
      }
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },

    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },

    setFeed: (state, action) => {
      state.feed = action.payload;
    },

    appendToFeed: (state, action) => {
      state.feed.push(...action.payload);
    },

    setTrendingPosts: (state, action) => {
      state.trendingPosts = action.payload;
    },

    incrementLikeCount: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.likeCount += 1;

      const feedPost = state.feed.find((p) => p.id === action.payload);
      if (feedPost) feedPost.likeCount += 1;
    },

    incrementCommentCount: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.commentCount += 1;

      const feedPost = state.feed.find((p) => p.id === action.payload);
      if (feedPost) feedPost.likeCount += 1;
    },

    setPostsLoading: (state, action) => {
      state.loading = action.payload;
    },

    setPostsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setCurrentPost,
  setFeed,
  appendToFeed,
  setTrendingPosts,
  incrementLikeCount,
  incrementCommentCount,
  setPostsLoading,
  setPostsError,
  setHasMore,
} = postsSlice.actions;

export default postsSlice.reducer;
