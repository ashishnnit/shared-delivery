import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const {
    adminPosts,
    getAllPostsForAdmin,
    deletePostForAdmin,
    getSuspeciousPosts,
  } = usePostStore();

  const navigate = useNavigate();

  useEffect(() => {
    getAllPostsForAdmin();
    getSuspeciousPosts();
  }, [getAllPostsForAdmin, getSuspeciousPosts]);

  const suspeciousPostButton = async () => {
    await getSuspeciousPosts();
    navigate("/suspicious-posts");
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePostForAdmin(postId);
    } catch (error) {
      if (error.response?.status === 404) {
        getAllPostsForAdmin();
      } else {
        toast.error("Failed to delete post.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4">
        {/* Header with Suspicious Posts button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">
            Admin Dashboard - Manage Posts
          </h1>
          <button
            onClick={suspeciousPostButton}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Suspicious Posts
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {adminPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium text-red-600">Name:</span>{" "}
                  <span className="text-gray-900">{post.fullName}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium text-red-600">Website:</span>{" "}
                  <span className="text-gray-900">{post.website}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium text-red-600">Amount:</span>{" "}
                  <span className="text-gray-900">${post.amount}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-red-600">Reports:</span>{" "}
                  <span className="text-gray-900">{post.reports.length}</span>
                </p>
              </div>

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
