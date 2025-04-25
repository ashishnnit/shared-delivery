import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { toast } from "react-hot-toast";

const AdminPage = () => {
  const { adminPosts, getAllPostsForAdmin, deletePostForAdmin } = usePostStore();

  // Fetch all posts on component mount
  useEffect(() => {
    getAllPostsForAdmin();
  }, [getAllPostsForAdmin]);

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      await deletePostForAdmin(postId); // Delete post by ID
    } catch (error) {
      if (error.response?.status === 404) {
        getAllPostsForAdmin(); // Refresh the posts to remove the deleted one
      } else {
        toast.error("Failed to delete post.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-10 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
          Admin Dashboard - Manage Posts
        </h1>
        <div className="space-y-6">
          {adminPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-between items-center"
            >
              {/* Post Details */}
              <div>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium text-red-600">Name:</span>{" "}
                  <span className="text-gray-900">{post.fullName}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium text-red-600">Website:</span>{" "}
                  <span className="text-gray-900">{post.website}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-red-600">Amount:</span>{" "}
                  <span className="text-gray-900">${post.amount}</span>
                </p>
              </div>

              {/* Delete Button */}
              <div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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

export default AdminPage;