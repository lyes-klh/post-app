import { Request, Response, NextFunction } from "express";
import Post from "../models/postModel";
import { PostSchema, PostType } from "../lib/validators/PostValidator";
import { QueryParamsSchema } from "../lib/validators/QueryParamsValidators";

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let page = 1;
  const limit = 5;

  const reqParams = QueryParamsSchema.safeParse(req.query);
  if (reqParams.success) page = reqParams.data.page;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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
