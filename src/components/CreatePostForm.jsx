import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreatePostMutation } from "../store/api/graphqlApi";
import { addPost } from "../store/slices/postsSlice";

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");

  const dispatch = useDispatch();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const result = await createPost({ content, visibility }).unwrap();

      dispatch(addPost(result.createPost.post));
      setContent("");

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className=" py-2 px-3 bg-white rounded-2xl">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="3"
          disabled={isLoading}
          className="w-full rounded-xl px-3 border-2 border-amber-300"
        />

        <div className="flex gap-10 justify-end items-center">
          <select
            className="px-2 py-1 rounded-xl border border-gray-400"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            disabled={isLoading}
          >
            <option value="public">Public</option>
            <option value="followers">Followers</option>
            <option value="private">Private</option>
          </select>

          <button
            className="text-sm"
            type="submit"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
