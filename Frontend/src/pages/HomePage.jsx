import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import FilterPage from "./FilterPage";
import { FaMapMarkerAlt } from "react-icons/fa";

const HomePage = () => {
  const { filteredPosts, getAllPosts, handleReportPost,getPostById } = usePostStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    getUserFromId,
    getUsers,
    unreadMessages,
    messages,
  } = useChatStore();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleViewOnMap = async (post) => {
    try {
      await getPostById(post._id);
      navigate("/post-map", { state: { post } });
    } catch (error) {
      if (error.response?.status === 404) {
        getAllPosts();
      }
    }
   
  };

  const handleStartChatting = async (user_id,postId) => {
    try {
      await getPostById(postId);
      await getUserFromId(user_id);
      navigate("/chatPage");
    } catch (error) {
      if (error.response?.status === 404) {
        getAllPosts();
      }
    }
    
  };

  const reportPost = async (postId, userId) => {
    try {
      await getPostById(postId);
      await handleReportPost(postId, userId);
    } catch (error) {
      if (error.response?.status === 404) {
        getAllPosts();
      }
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10 flex">
      <div className="container mx-auto px-4 flex">
        {/* Main Content */}
        <div className="flex-1 pr-96">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
            All Posts
          </h1>
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-between items-center"
              >
                {/* Post Details */}
                <div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium text-purple-600">Name:</span>{" "}
                    <span className="text-gray-900">{post.fullName}</span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium text-purple-600">Website:</span>{" "}
                    <span className="text-gray-900">{post.website}</span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium text-purple-600">Amount:</span>{" "}
                    <span className="text-gray-900">${post.amount}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-red-500">Reports:</span>{" "}
                    <span className="text-gray-900">{post.reports?.length || 0}</span>
                  </p>
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col space-y-2 items-end">
                  <button
                    onClick={() => handleViewOnMap(post)}
                    className="w-36 flex items-center px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    View on Map
                  </button>

                  <button
                    onClick={() => handleStartChatting(post.user_id,post._id)}
                    className="w-36 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    Start Chatting
                  </button>

                  <button
                    onClick={() => reportPost(post._id, authUser._id)}
                    disabled={post.reports.includes(authUser._id)}
                    className={`w-36 px-3 py-1.5 rounded-lg text-sm ${
                      post.reports.includes(authUser._id)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {post.reports.includes(authUser._id) ? "Reported" : "Report"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Sidebar */}
        <FilterPage />
      </div>
    </div>
  );
};

export default HomePage;
