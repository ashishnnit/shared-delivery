import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5002";

export const usePostStore = create((set, get) => ({
  posts: [],
  adminPosts:[],
  myPosts: [],
  editedPost: null,
  filteredPosts: [],

  // Create a new post
  createPost: async (data) => {
    try {
      console.log("data", data);
      const res = await axiosInstance.post("/posts/createPost", data);
      toast.success("Post Created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Fetch all posts and store them in the `posts` array
  getAllPosts: async () => {
    try {
      const res = await axiosInstance.get("/posts/getAllPosts");
      set({ posts: res.data, filteredPosts: res.data }); // Initialize filteredPosts with all posts
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getAllPostsForAdmin: async () => {
    try {
      const res = await axiosInstance.get("/posts/getAllPostsForAdmin");
      set({ adminPosts: res.data, filteredPosts: res.data }); // Initialize filteredPosts with all posts
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  getMyPosts: async () => {
    try {
      const res = await axiosInstance.get("/posts/getMyPosts");
      set({ myPosts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  editMyPost: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/posts/editMyPost/${id}`, data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getPostById: async (id) => {
    try {
      const res = await axiosInstance.get(`posts/${id}`);
      set({ editedPost: res.data });
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("This post is no longer available.");
        get().getMyPosts(); // Refresh the user's posts
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch post.");
      }
      throw error; // Rethrow the error to handle it in the component
    }
  },

  deleteMyPost: async (id) => {
    try {
      const res = await axiosInstance.post(`posts/deleteMyPost/${id}`);
      set((state) => ({
        myPosts: state.myPosts.filter((post) => post._id !== id), // Remove the deleted post from the state
      }));
      toast.success(res.data.message || "Post deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("This post is no longer available.");
        get().getMyPosts(); // Refresh the user's posts to remove the deleted one
      } else {
        toast.error(error.response?.data?.message || "Failed to delete post.");
      }
      throw error; // Rethrow the error to handle it in the component
    }
  },

  deletePostForAdmin: async (id) => {
    try {
      const res = await axiosInstance.post(`posts/deletePostForAdmin/${id}`);
      set((state) => ({
        adminPosts: state.adminPosts.filter((post) => post._id !== id), // Remove the deleted post from the state
      }));
      toast.success(res.data.message || "Post deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("This post is no longer available.");
        get().getAllPostsForAdmin(); // Refresh the admin's posts to remove the deleted one
      } else {
        toast.error(error.response?.data?.message || "Failed to delete post.");
      }
      throw error; // Rethrow the error to handle it in the component
    }
  },



  // Apply filters to posts
  applyFilters: (filters) => {
    const { posts } = get();
    let filtered = posts;

    // Filter by website name
    if (filters.website) {
      filtered = filtered.filter((post) =>
        post.website.toLowerCase().includes(filters.website.toLowerCase())
      );
    }

    // Filter by amount range
    if (filters.minAmount || filters.maxAmount) {
      const min = filters.minAmount ? parseFloat(filters.minAmount) : -Infinity;
      const max = filters.maxAmount ? parseFloat(filters.maxAmount) : Infinity;
      filtered = filtered.filter(
        (post) => post.amount >= min && post.amount <= max
      );
    }

    // Filter by distance (if user's location is available)
    if (filters.distance && navigator.geolocation) {
      const maxDistance = parseFloat(filters.distance);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          filtered = filtered.filter((post) => {
            const postLat = post.latitude;
            const postLon = post.longitude;
            const distance = get().haversineDistance(userLat, userLon, postLat, postLon); // Use get().haversineDistance
            return distance <= maxDistance;
          });

          set({ filteredPosts: filtered }); // Update filteredPosts in the store
        },
        (error) => {
          console.error("Error fetching user location:", error);
          toast.error("Failed to fetch your location.");
        }
      );
    } else {
      set({ filteredPosts: filtered }); // Update filteredPosts in the store
    }
  },

  // Haversine distance function
  haversineDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = get().toRadians(lat2 - lat1); // Use get().toRadians
    const dLon = get().toRadians(lon2 - lon1); // Use get().toRadians
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(get().toRadians(lat1)) *
        Math.cos(get().toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Convert degrees to radians
  toRadians: (degrees) => degrees * (Math.PI / 180),
}));