import mongoose from "mongoose";
import { PostType } from "../lib/validators/PostValidator";

const postSchema = new mongoose.Schema<PostType>(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model<PostType>("Post", postSchema);

export default PostModel;
