import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { usePostStore } from "../store/usePostStore";

const EditPostPage = () => {
  const { id } = useParams(); // Extract post ID from URL
  const navigate = useNavigate();
  const { editMyPost,editedPost } = usePostStore(); // Use the store method
  const [formData, setFormData] = useState({
    website: "",
    amount: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure form data
    const { website, amount } = formData;

    // Basic validation
    if (!website || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check if amount is a valid number
    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
     // await editMyPost(id,formData); // Call the editPost method from the store
      toast.success("Post updated successfully!");
      await editMyPost(id,formData);
      navigate("/myPosts"); // Redirect to the My Posts page after successful update
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to update post.");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Edit Post
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="text"
              name="website"
              placeholder={editedPost.post.website}
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              placeholder={editedPost.post.amount}
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;