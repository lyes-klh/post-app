import mongoose from 'mongoose';
import { TPost } from '@post-app/validation';

const postSchema = new mongoose.Schema<TPost>(
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

const PostModel = mongoose.model<TPost>('Post', postSchema);

export default PostModel;
