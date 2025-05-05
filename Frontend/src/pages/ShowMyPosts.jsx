import React from "react";
import { usePostStore } from "../store/usePostStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ShowMyPosts = () => {
  const { myPosts, getMyPosts, getPostById, deleteMyPost } = usePostStore();
  const navigate = useNavigate();

  useEffect(() => {
    getMyPosts();
  }, [getMyPosts]);

  const handleEdit = async (postId) => {
    try {
      await getPostById(postId);
      navigate(`/editPost/${postId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        getMyPosts();
      }
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteMyPost(postId);
      getMyPosts();
    } catch (error) {
      if (error.response?.status === 404) {
        getMyPosts();
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

        <div className="space-y-6">
          {myPosts.map((post) => (
            <div
              key={post._id}
              className="relative bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
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

                {/* Report Count in Red */}
                <p className="text-red-600 font-medium">
                  Reports: <span className="font-bold">{post.reports.length || 0}</span>
                </p>
              </div>

              {/* Buttons aligned to vertical middle right */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                <button
                  onClick={() => handleEdit(post._id)}
                  className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 focus:outline-none"
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
