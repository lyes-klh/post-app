import { Request, Response, NextFunction } from "express";
import Post from "../models/postModel";
import { PostSchema, PostType } from "../lib/validators/PostValidator";

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "success",
      data: posts,
    });
  } catch (error) {
    res.status(200).json({
      message: "failed to get posts",
    });
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postParsed = PostSchema.safeParse(req.body);

  if (postParsed.success) {
    const post = await Post.create(postParsed.data);

    res.status(201).json({
      message: "success",
      data: post,
    });
  } else {
    res.status(400).json({
      message: "failed, please provide the correct post attributes",
    });
  }
};
