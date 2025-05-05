import React, { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';
import {useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfileForAdmin = () => {
  const { usersPostForAdmin,deletePostForAdmin,seeUserProfile,deleteUserForAdmin } = usePostStore();

  const {id}=useParams();

  const navigate = useNavigate();


  const handleDeletePost = async ({postId,userId}) => {
    try {
      await deletePostForAdmin(postId);
      await seeUserProfile(userId);
    } catch (error) {
      if (error.response?.status === 404) {
        seeUserProfile(userId);
      } else {
        toast.error("Failed to delete post.");
      }
    }
  };

  const handleRemoveUser = async () => {
    try {
      await deleteUserForAdmin(id);
      navigate("/suspicious-posts");
    } catch (error) {
      if (error.response?.status === 404) {
        seeUserProfile(id);
      } else {
        toast.error("Failed to delete user account.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          User Profile (Admin View)
        </h1>

        {usersPostForAdmin.length === 0 ? (
          <p className="text-center text-gray-500">No posts found for this user.</p>
        ) : (
          <div className="space-y-6">
            {usersPostForAdmin.map((post) => (
              <div
                key={post._id}
                className="bg-gray-100 rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Name:</span> {post.fullName}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Website:</span> {post.website}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Amount:</span> ${post.amount}
                  </p>
                  <p className="text-red-600 font-medium">
                    Reports: {post.reports.length}
                  </p>
                </div>

                <button
                  onClick={() => handleDeletePost( {postId: post._id, userId: post.user_id })}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Delete Account Button */}
        <div className="flex justify-center mt-10">
          <button 
            onClick={() => handleRemoveUser()}
           className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
           >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForAdmin;
