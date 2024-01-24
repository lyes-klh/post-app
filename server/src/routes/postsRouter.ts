import { Router } from "express";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from "../controllers/postsController";

const router = Router();

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").patch(updatePost).delete(deletePost);

export default router;
