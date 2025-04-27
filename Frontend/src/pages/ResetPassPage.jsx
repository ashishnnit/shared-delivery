import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useParams,useNavigate } from "react-router-dom"; 

const ResetPassPage = () => {

  const { resetPassword } = useAuthStore();
  const { token } = useParams();
  const Navigate = useNavigate(); // Initialize useNavigate
  console.log("token", token); // Log the token to check if it's being received correctly

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: token || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    await resetPassword(formData);

    Navigate("/login"); // Redirect to login page after successful password reset
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassPage;