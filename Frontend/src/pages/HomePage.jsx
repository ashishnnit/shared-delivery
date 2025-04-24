import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import FilterPage from "./FilterPage";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location marker icon

const HomePage = () => {
  const { posts, filteredPosts, getAllPosts } = usePostStore();
  const navigate = useNavigate();
  const {getUserFromId } = useChatStore();
  
  const { 
    getUsers, 
    unreadMessages,
    messages
} = useChatStore();

// kaam chalau code for home page number of message count

useEffect(() => {
  getUsers();
}, [getUsers,unreadMessages,messages]);

// Khatam

  // Fetch posts on component mount
  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  // Navigate to the map page with post data
  const handleViewOnMap = (post) => {
    navigate("/post-map", { state: { post } });
  };

  // Navigate to the chat page
  const handleStartChatting = async (user_id) => {
    await getUserFromId(user_id);
    navigate("/chatPage"); // Redirect to the home or chat route
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
                  <p className="text-gray-700">
                    <span className="font-medium text-purple-600">Amount:</span>{" "}
                    <span className="text-gray-900">${post.amount}</span>
                  </p>
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col space-y-2">
                  {/* View on Map Button */}
                  <button
                    onClick={() => handleViewOnMap(post)}
                    className="flex items-center px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                  >
                    <FaMapMarkerAlt className="mr-2" /> {/* Location marker icon */}
                    View on Map
                  </button>

                  {/* Start Chatting Button */}
                  <button
                    onClick={() => handleStartChatting(post.user_id)}
                    className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    Start Chatting
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