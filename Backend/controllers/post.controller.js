import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { io } from "../lib/socket.js";

export const createPost = async (req, res) => {
    const { website, amount, longitude, latitude } = req.body; // Add longitude and latitude
    const fullName = req.user.fullName;
    const user_id = req.user._id;
  
    try {
      if (!website || !amount || !longitude || !latitude) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newPost = new Post({
        fullName,
        website,
        amount,
        user_id,
        longitude, // Save longitude
        latitude, // Save latitude
      });
  
      await newPost.save();

      io.emit("postsUpdated", newPost); // Emit event to notify clients about the update

      if (newPost) {
        res.status(201).json({
          _id: newPost._id,
          fullName: newPost.fullName,
          website: newPost.website,
          amount: newPost.amount,
          user_id: newPost.user_id,
          longitude: newPost.longitude, // Include longitude in the response
          latitude: newPost.latitude, // Include latitude in the response
        });
      } else {
        return res.status(400).json({ message: "Invalid post data" });
      }
    } catch (error) {
      console.log("Error in post controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

 export const getMyPosts=async (req, res) => {
    try {
        const posts=await Post.find({user_id:req.user._id});
        if(posts){
            res.status(200).json(posts);
        }else{
            return res.status(404).json({message:"No posts found"});
        }
    } catch (error) {
        console.log("Error in getPosts controller",error.message);
        res.status(500).json({message:"Internal Server  Error"});
    }
}

export const getAllPosts=async (req, res) => {
    try {
        const posts = await Post.find({ user_id: { $ne: req.user._id } }); // $ne means "not equal"
        if (posts.length > 0) {
            res.status(200).json(posts);
        } else {
            return res.status(404).json({ message: "No posts found" });
        }
    } catch (error) {
        console.log("Error in getPosts controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}

export const getAllPostsForAdmin=async (req, res) => {
  try {
      const posts = await Post.find(); 
      if (posts.length > 0) {
          res.status(200).json(posts);
      } else {
          return res.status(404).json({ message: "No posts found" });
      }
  } catch (error) {
      console.log("Error in getPosts controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
  
}

export const deleteMyPost = async (req, res) => {
    try {
        const { id } = req.params; // Extract post ID from URL

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        io.emit("postsUpdated", deletedPost); // Emit event to notify clients about the update

        res.status(200).json({ message: "Post deleted successfully"});
    } catch (error) {
        console.log("Error in deleteMyPost controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deletePostForAdmin = async (req, res) => {
  try {
      const { id } = req.params; // Extract post ID from URL

      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
          return res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json({ message: "Post deleted successfully"});
  } catch (error) {
      console.log("Error in deleteMyPost controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
    const { id } = req.params; // Extract post ID from URL
  
    try {
      // Find the post by ID
      const post = await Post.findById(id);
  
      // If post is not found, return a 404 error
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Return the post data with a success message
      res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
      console.log("Error in getPostById controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const editMyPost = async (req, res) => {
    const { id } = req.params;  // Extract post ID from URL
    const { website, amount } = req.body;  // Extract new values

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { website, amount },
            { new: true } // Return updated document
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        await updatedPost.save();

        io.emit("postsUpdated", updatedPost); // Emit event to notify clients about the update


        res.status(200).json(updatedPost);
    } catch (error) {
        console.log("Error in editMyPost controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

  export const reportPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const  userId  = req.user._id; // Get the user ID from the request body

        // Find the post to report
        const post = await Post.findById(postId);
        const postUserId=post.user_id;
    
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
       
        if (!post.reports.includes(userId)) {
          const postUserUpdate=await User.findByIdAndUpdate(
            postUserId,
            { $inc: { reports: 1 } }, // Increment the reports count for the user
            { new: true } // Return updated document
        );

          io.emit("postsUpdated", post); // Emit event to notify clients about the update

          post.reports.push(userId);
          await post.save();
          res.status(200).send({ message: 'Post reported successfully' });
        } else {
          res.status(400).send({ message: 'You have already reported this post' });
        }
      } catch (error) {
        res.status(500).send({ message: 'Server error' });
      }
  };

  export const getSuspeciousPosts = async (req, res) => {
    try {
      const posts = await Post.find({
        $expr: { $gte: [{ $size: { $ifNull: ["$reports", []] } }, 2] }
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const getUserPostForAdmin = async (req, res) => {
    const { userId } = req.params; // Extract post ID from URL
  
    try {
      const posts = await Post.find({ user_id: userId });
      if (posts.length > 0) {
        res.status(200).json(posts);
      }
      else {
        return res.status(404).json({ message: "No posts found" });
    }
} catch (error) {
    console.log("Error in getPosts controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  };

};

export const deleteUserForAdmin = async (req, res) => {
    const { userId } = req.params; // Extract user ID from URL

    try {
        const deleteUserPosts = await Post.deleteMany({ user_id: userId }); // Delete all posts by the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.log("Error in deleteUserForAdmin controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}



 