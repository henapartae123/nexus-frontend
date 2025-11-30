import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllPostsQuery,
  // useGetFollowingFeedQuery,
} from "../store/api/graphqlApi";
import { useEffect, useState } from "react";
// import { setFeed, setPostsLoading } from "../store/slices/postsSlice";
import {
  setPosts,
  setPostsError,
  setPostsLoading,
} from "../store/slices/postsSlice";
import Postcard from "../components/Postcard";
import CreatePostForm from "../components/CreatePostForm";
import MeCard from "../components/MeCard";

const Home = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // const { data, isLoading, error } = useGetAllPostsQuery();
  const { data, isLoading, error, refetch } = useGetAllPostsQuery();
  // const feed = useSelector((state) => state.posts.feed);
  const posts = useSelector((state) => state.posts.posts);

  // useEffect(() => {
  //   if (data?.followingFeed) {
  //     dispatch(setFeed(data.followingFeed));
  //     // console.log(data);
  //   }
  // }, [data, dispatch]);

  useEffect(() => {
    if (data?.allPosts) {
      dispatch(setPosts(data.allPosts));
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setPostsLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setPostsError(error.message));
    }
  }, [error, dispatch]);

  const filteredPosts = posts
    .filter((post) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          post.content.toLowerCase().includes(searchLower) ||
          post.author.displayName.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort based on filter
      switch (filter) {
        case "trending": {
          // Sort by engagement (likes + comments)
          const engagementA = a.likeCount + a.commentCount;
          const engagementB = b.likeCount + b.commentCount;
          return engagementB - engagementA;
        }
        case "recent":
          // Sort by date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="all-posts-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-posts-page">
        <div className="error-container">
          <h2>Error Loading Posts</h2>
          <p>{error.message}</p>
          <button onClick={handleRefresh}>Try Again</button>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="all-posts-page">
        <div className="error-container">
          <h2>Error Loading Posts</h2>
          <p>{error.message}</p>
          <button onClick={handleRefresh}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-5 px-10 py-3 h-screen justify-between bg-gray-200">
      <div className="flex flex-col w-1/5 gap-3 bg-white rounded-2xl">
        <MeCard />
      </div>

      <div className="flex flex-col w-3/5 gap-5">
        <CreatePostForm />
        {/* <div className="flex flex-row gap-3 px-3 py-2 bg-white rounded-2xl">
          <div>1</div>
          <div className="flex flex-col gap-2">
            <div>2</div>
            <div>2</div>
          </div>
        </div> */}

        <div className="flex flex-row gap-5">
          <h2>Trending</h2>
          <h2>Following</h2>
        </div>

        <div className="flex flex-col gap-5 px-3 py-2 bg-white rounded-2xl">
          {isLoading ? (
            <div className="loading">Loading feed...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-feed">
              <p>Your feed is empty. Follow some users to see their posts!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {filteredPosts.map((post) => (
                <Postcard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-1/5">3</div>
    </div>
  );
};

export default Home;
