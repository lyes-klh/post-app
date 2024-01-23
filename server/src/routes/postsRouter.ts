import { Router } from "express";
import { createPost, getAllPosts } from "../controllers/postsController";

const router = Router();

router.route("/").get(getAllPosts).post(createPost);

export default router;
