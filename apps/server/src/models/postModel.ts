import mongoose from 'mongoose';
import { PostType } from '@post-app/validation';

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
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: { type: [String], default: [] },
  },
  { timestamps: true },
);

const PostModel = mongoose.model<PostType>('Post', postSchema);

export default PostModel;
