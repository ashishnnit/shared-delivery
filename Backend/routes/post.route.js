import express from 'express';
import { createPost,getMyPosts,getAllPosts,deleteMyPost,editMyPost,getPostById} from '../controllers/post.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/createPost",protectRoute,createPost);
router.get("/getMyPosts",protectRoute,getMyPosts);
router.get("/getAllPosts",protectRoute,getAllPosts);
router.put("/editMyPost/:id", protectRoute, editMyPost);
router.post("/deleteMyPost/:id",protectRoute,deleteMyPost);
router.get("/:id",protectRoute,getPostById);


export default router;
