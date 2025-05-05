import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const AdminSuspeciousPost = () => {
  const { suspeciousPosts, getSuspeciousPosts, deletePostForAdmin,seeUserProfile } = usePostStore();

  useEffect(() => {
    getSuspeciousPosts();
  }, [getSuspeciousPosts]);

  const navigate = useNavigate();

  const handleDelete = async (postId) => {
    try {
      await deletePostForAdmin(postId);
      await getSuspeciousPosts();
    } catch (error) {
      if (error.response?.status === 404) {
        getSuspeciousPosts();
      } else {
        toast.error("Failed to delete post.");
      }
    }
  };

  const handleSeeUserProfile = async (userId) => {
     await seeUserProfile(userId);
     try {
      navigate(`/userProfileForAdmin/${userId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        getSuspeciousPosts();
      } else {
        toast.error("Error fetching user profile.");
      }
    }
  
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
          Suspicious Posts
        </h1>

        {suspeciousPosts.length === 0 ? (
          <p className="text-center text-gray-500">No suspicious posts found.</p>
        ) : (
          <div className="space-y-6">
            {suspeciousPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center"
              >
                {/* Post Details */}
                <div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-red-500">Name:</span>{" "}
                    {post.fullName}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-red-500">Website:</span>{" "}
                    {post.website}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-red-500">Amount:</span>{" "}
                    ${post.amount}
                  </p>
                  <p className="text-red-600 font-medium">
                    Reports: {post.reports.length}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 items-end justify-center">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="w-32 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSeeUserProfile(post.user_id)}
                    className="w-32 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                  User Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSuspeciousPost;
