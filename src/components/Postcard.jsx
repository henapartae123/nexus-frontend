import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateCommentMutation,
  useReactToPostMutation,
} from "../store/api/graphqlApi";
import {
  incrementCommentCount,
  incrementLikeCount,
} from "../store/slices/postsSlice";
// import { getNumericId } from "../utls/idHelpers";

const Postcard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reactToPost] = useReactToPostMutation();

  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();

  //   const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  //   console.log("Full post object:", post);
  //   console.log("post.id:", post.id);

  const handleLike = async () => {
    try {
      // Extract numeric ID from relay global ID if needed
      const postId = post.id;
      //     typeof post.id === "string" && post.id.includes(":")
      //       ? parseInt(post.id.split(":").pop())
      //       : parseInt(post.id);

      //   console.log(postId);

      console.log("Liking post with ID:", postId); // Debug log

      await reactToPost({ postId, reactionType: "like" }).unwrap();
      dispatch(incrementLikeCount(post.id));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    try {
      await createComment({
        postId: post.id,
        content: commentText.trim(),
      }).unwrap();

      dispatch(incrementCommentCount(post.id));
      setCommentText("");
      //   setShowCommentForm(false);
    } catch (err) {
      setCommentError(err.data?.message || "Error posting comment");
      console.error("Error creating comment:", err);
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.author.user.username}`);
  };

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  //   const toggleCommentForm = () => {
  //     setShowCommentForm(!showCommentForm);
  //     setCommentError("");
  //   };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-3">
        {/* <div className="rounded-full bg-amber-500 w-8 h-8">
          {post.author.avatarUrl && (
            <img src={post.author.avatarUrl} alt={post.author.displayName} />
          )}
        </div> */}
        <div className="flex flex-col">
          <div className="text-sm cursor-pointer" onClick={handleProfileClick}>
            {post.author.displayName}
          </div>
          <div className="text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <p onClick={handlePostClick}>{post.content}</p>
      <div className="flex flex-row items-center gap-3">
        <div className="w-1/10">1</div>
        <div className="w-5/12">
          {/* {showCommentForm && ( */}
          <div className="comment-form-container">
            <form
              onSubmit={handleCommentSubmit}
              className="flex flex-row gap-5"
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="2"
                disabled={isCommenting}
                className="rounded-xl px-3 border-2 border-amber-300"
              />
              {commentError && (
                <div className="comment-error">{commentError}</div>
              )}
              <div className="flex gap-5 justify-between text-sm">
                <button
                  type="submit"
                  className=""
                  disabled={isCommenting || !commentText.trim()}
                >
                  {isCommenting ? "Posting..." : "Send"}
                </button>
                {/* <button
                    type="button"
                    onClick={toggleCommentForm}
                    className="cancel-btn"
                    disabled={isCommenting}
                  >
                    Cancel
                  </button> */}
              </div>
            </form>
          </div>
          {/* )} */}
        </div>
        <div className="w-1/4">
          <button onClick={handleLike} className="cursor-pointer">
            ❤️ {post.likeCount} Likes
          </button>
        </div>
        <div className="w-1/4">💬 {post.commentCount} Comments </div>
      </div>
    </div>
  );
};

export default Postcard;
