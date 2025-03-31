import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
      website: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
      },
      longitude: {
        type: Number, // Add longitude field
        required: true, // Make it required if you want every post to have a location
      },
      latitude: {
        type: Number, // Add latitude field
        required: true, // Make it required if you want every post to have a location
      },
    },
    { timestamps: true }
  );
  
  const Post = mongoose.model("Post", postSchema);
  export default Post;