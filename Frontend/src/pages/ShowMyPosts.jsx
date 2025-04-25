import React from "react";
import { usePostStore } from "../store/usePostStore"; // Import the store
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ShowMyPosts = () => {
  const { myPosts, getMyPosts ,getPostById,deleteMyPost} = usePostStore(); // Get myPosts and getMyPosts from the store
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch my posts on component mount
  useEffect(() => {
    getMyPosts(); // Fetch all my posts
  }, [getMyPosts]);


  // Handle Edit Button Click
  const handleEdit = async (postId) => {
    try {
      await getPostById(postId); // Fetch post data by ID
      navigate(`/editPost/${postId}`); // Redirect to the editPost route with the post ID
    } catch (error) {
      if (error.response?.status === 404) {
        getMyPosts(); // Refresh the posts to remove the deleted one
      }
    }
  };

  // Handle Delete Button Click
  const handleDelete = async (postId) => {
    try {
      await deleteMyPost(postId); // Delete post by ID
      getMyPosts(); // Refresh the posts after deletion
    } catch (error) {
      if (error.response?.status === 404) {
        getMyPosts(); // Refresh the posts to remove the deleted one
      } else {
        toast.error("Failed to delete post.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
          My Posts
        </h1>

        {/* Display My Posts */}
        <div className="space-y-6">
          {myPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Name */}
              <p className="text-gray-700 mb-2">
                <span className="font-medium text-purple-600">Name:</span>{" "}
                <span className="text-gray-900">{post.fullName}</span>
              </p>

              {/* Website (not clickable) */}
              <p className="text-gray-700 mb-2">
                <span className="font-medium text-purple-600">Website:</span>{" "}
                <span className="text-gray-900">{post.website}</span>
              </p>

              {/* Amount */}
              <p className="text-gray-700 mb-4">
                <span className="font-medium text-purple-600">Amount:</span>{" "}
                <span className="text-gray-900">${post.amount}</span>
              </p>

              {/* Edit and Delete Buttons */}
              <div className="flex justify-end space-x-4">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(post._id)}
                  className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(post._id)}
                  className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowMyPosts;