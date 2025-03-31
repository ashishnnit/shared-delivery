import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { usePostStore } from "../store/usePostStore";

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    website: "",
    amount: "",
    longitude: null, // Add longitude to form data
    latitude: null, // Add latitude to form data
  });
  const { createPost } = usePostStore();
  const navigate = useNavigate();

  // Fetch user's location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            resolve({ longitude, latitude }); // Resolve with location data
          },
          (error) => {
            console.error("Error fetching location:", error);
            reject(error); // Reject if there's an error
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by your browser."));
      }
    });
  };

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
      // Fetch user's location
      const { longitude, latitude } = await getLocation();

      // Add location to form data
      const updatedFormData = { ...formData, longitude, latitude };

      // Create post with location data
      await createPost(updatedFormData);

      // Navigate to the myPosts page
      navigate("/myPosts");
    } catch (error) {
      console.error("Error fetching location or creating post:", error);
      toast.error("Failed to fetch location or create post.");
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
          Create a New Post
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
              placeholder="Enter website URL"
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
              placeholder="Enter amount"
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
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;