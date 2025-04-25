import express from 'express';
import { createPost,getMyPosts,getAllPosts,deleteMyPost,editMyPost,getPostById,getAllPostsForAdmin,deletePostForAdmin} from '../controllers/post.controller.js';
import { protectRoute,protectRouteAdmin} from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/createPost",protectRoute,createPost);
router.get("/getMyPosts",protectRoute,getMyPosts);
router.get("/getAllPosts",protectRoute,getAllPosts);
router.get("/getAllPostsForAdmin",protectRouteAdmin,getAllPostsForAdmin);
router.put("/editMyPost/:id", protectRoute, editMyPost);
router.post("/deleteMyPost/:id",protectRoute,deleteMyPost);
router.post("/deletePostForAdmin/:id",protectRouteAdmin,deletePostForAdmin);
router.get("/:id",protectRoute,getPostById);


export default router;
