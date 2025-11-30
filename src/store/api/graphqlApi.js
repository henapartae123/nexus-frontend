import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { GraphQLClient } from "graphql-request";

const API_URL =
  import.meta.env.REACT_APP_GRAPHQL_URL;
// process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:8000/graphql/';

// Create GraphQL client
const client = new GraphQLClient(API_URL);

// Base query with auth token
const baseQuery = graphqlRequestBaseQuery({
  client,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `JWT ${token}`);
    }
    return headers;
  },
});

export const graphqlApi = createApi({
  reducerPath: "graphqlApi",
  baseQuery,
  tagTypes: ["Post", "Profile", "Comment", "Notification"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: ({ username, password }) => ({
        document: `
      mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
          refreshToken
          user {
            id
            user {
              username
            }
            displayName
            bio
            avatarUrl
          }
        }
      }
    `,
        variables: { username, password },
      }),
      transformResponse: (response) => ({
        token: response.tokenAuth.token,
        refreshToken: response.tokenAuth.refreshToken,
        user: response.tokenAuth.user,
      }),
    }),

    createUser: builder.mutation({
      query: ({ username, password, email, displayName }) => ({
        document: `
          mutation CreateUser($username: String!, $password: String!, $email: String, $displayName: String) {
            createUser(username: $username, password: $password, email: $email, displayName: $displayName) {
              user {
                id
                displayName
                bio
                avatarUrl
              }
              token
              refreshToken
            }
          }
        `,
        variables: { username, password, email, displayName },
      }),
      transformResponse: (response) => {
        return {
          user: response.createUser.user,
          token: response.createUser.token,
          refreshToken: response.createUser.refreshToken,
        };
      },
    }),

    // Profile endpoints
    getMe: builder.query({
      query: () => ({
        document: `
          query Me {
            me {
              id
              displayName
              bio
              avatarUrl
              followerCount
              followingCount
            }
          }
        `,
      }),
      providesTags: ["Profile"],
    }),

    getProfileByUsername: builder.query({
      query: (username) => ({
        document: `
          query ProfileByUsername($username: String!) {
            profileByUsername(username: $username) {
              id
              displayName
              bio
              createdAt
              avatarUrl
              followerCount
              followingCount
              posts {
                id
                content
                likeCount
                commentCount
                createdAt
                author {
                id
                displayName
                avatarUrl
                user {
                  username
                }
              }
              }
            }
          }
        `,
        variables: { username },
      }),
      providesTags: ["Profile"],
    }),

    // Posts endpoints
    getAllPosts: builder.query({
      query: () => ({
        document: `
          query AllPosts {
            allPosts {
              id
              content
              likeCount
              commentCount
              createdAt
              author {
                id
                displayName
                avatarUrl
                user {
                  username
                }
              }
            }
          }
        `,
      }),
      providesTags: ["Post"],
    }),

    getFollowingFeed: builder.query({
      query: () => ({
        document: `
          query FollowingFeed {
            followingFeed {
              id
              content
              likeCount
              commentCount
              createdAt
              author {
                id
                displayName
                avatarUrl
              }
            }
          }
        `,
      }),
      providesTags: ["Post"],
    }),

    getTrendingFeed: builder.query({
      query: () => ({
        document: `
          query TrendingFeed {
            trendingFeed {
              id
              content
              likeCount
              commentCount
              createdAt
              author {
                id
                displayName
                avatarUrl
              }
            }
          }
        `,
      }),
      providesTags: ["Post"],
    }),

    getPost: builder.query({
      query: (id) => ({
        document: `
          query Post($id: Int!) {
            post(id: $id) {
              id
              content
              likeCount
              commentCount
              createdAt
              author {
                id
                displayName
                avatarUrl
              }
              comments {
                id
                content
                createdAt
                author {
                  id
                  displayName
                  avatarUrl
                }
              }
            }
          }
        `,
        variables: { id: parseInt(id) },
      }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    createPost: builder.mutation({
      query: ({ content, visibility }) => ({
        document: `
          mutation CreatePost($content: String!, $visibility: String) {
            createPost(content: $content, visibility: $visibility) {
              post {
                id
                content
                likeCount
                commentCount
                createdAt
                author {
                  id
                  displayName
                  avatarUrl
                }
              }
            }
          }
        `,
        variables: { content, visibility },
      }),
      invalidatesTags: ["Post"],
    }),

    createComment: builder.mutation({
      query: ({ postId, content }) => ({
        document: `
          mutation CreateComment($postId: Int!, $content: String!) {
            createComment(postId: $postId, content: $content) {
              comment {
                id
                content
                createdAt
                author {
                  id
                  displayName
                  avatarUrl
                }
              }
            }
          }
        `,
        variables: { postId: parseInt(postId), content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        "Comment",
      ],
    }),

    reactToPost: builder.mutation({
      query: ({ postId, reactionType }) => ({
        document: `
          mutation ReactToPost($postId: String!, $reactionType: String) {
            reactToPost(postId: $postId, reactionType: $reactionType) {
              ok
            }
          }
        `,
        variables: { postId: String(postId), reactionType },
      }),
      // invalidatesTags: (result, error, { postId }) => [
      //   { type: "Post", id: postId },
      // ],
    }),

    // Follow endpoints
    followUser: builder.mutation({
      query: (userId) => ({
        document: `
          mutation FollowUser($userId: Int!) {
            followUser(userId: $userId) {
              ok
            }
          }
        `,
        variables: { userId: parseInt(userId) },
      }),
      invalidatesTags: ["Profile"],
    }),

    unfollowUser: builder.mutation({
      query: (userId) => ({
        document: `
          mutation UnfollowUser($userId: Int!) {
            unfollowUser(userId: $userId) {
              ok
            }
          }
        `,
        variables: { userId: parseInt(userId) },
      }),
      invalidatesTags: ["Profile"],
    }),

    // Notifications endpoints
    getMyNotifications: builder.query({
      query: (unreadOnly = false) => ({
        document: `
          query MyNotifications($unreadOnly: Boolean) {
            myNotifications(unreadOnly: $unreadOnly) {
              id
              type
              isRead
              createdAt
              actor {
                id
                displayName
                avatarUrl
              }
              post {
                id
                content
              }
            }
          }
        `,
        variables: { unreadOnly },
      }),
      providesTags: ["Notification"],
    }),

    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        document: `
          mutation MarkNotificationRead($notificationId: Int!) {
            markNotificationRead(notificationId: $notificationId) {
              ok
            }
          }
        `,
        variables: { notificationId: parseInt(notificationId) },
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useGetMeQuery,
  useGetProfileByUsernameQuery,
  useGetAllPostsQuery,
  useGetFollowingFeedQuery,
  useGetTrendingFeedQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useCreateCommentMutation,
  useReactToPostMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} = graphqlApi;
