import { Request, Response } from "express";
import Post from "../models/postModel";
import { PostSchema, PostType } from "../lib/validators/PostValidator";
import { QueryParamsSchema, PathParamsSchema } from "../lib/validators/ParamsValidators";
import { ZodError } from "zod";

export const getAllPosts = async (req: Request, res: Response) => {
  let page = 1;
  const limit = 5;

  try {
    const queryParams = QueryParamsSchema.parse(req.query);
    page = queryParams.page;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "success",
      data: posts,
    });
  } catch (error) {
    const message = error instanceof ZodError ? error.errors : "Failed to get posts";
    const statusCode = error instanceof ZodError ? 400 : 500;

    res.status(statusCode).json({
      message,
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const postParsed = PostSchema.parse(req.body);
    const post = await Post.create(postParsed);

    res.status(201).json({
      message: "success",
      data: post,
    });
  } catch (error) {
    const message = error instanceof ZodError ? error.errors : "Failed to create post";
    const statusCode = error instanceof ZodError ? 400 : 500;

    res.status(statusCode).json({
      message,
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const pathParams = PathParamsSchema.parse(req.params);
    const postParsed = PostSchema.partial()
      .refine((data) => Object.keys(data).length > 0, {
        message: "Post must have at least one attribute",
      })
      .parse(req.body);

    const post = await Post.findByIdAndUpdate(pathParams.id, postParsed, { new: true });

    res.status(201).json({
      message: "success",
      data: post,
    });
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.errors
        : "Failed to update post, please provide the correct post id or the correct post attributes";
    const statusCode = error instanceof ZodError ? 400 : 500;

    res.status(statusCode).json({
      message,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const pathParams = PathParamsSchema.parse(req.params);
    await Post.findByIdAndDelete(pathParams.id);

    res.status(204).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    const message = error instanceof ZodError ? error.errors : "Failed to delete post";
    const statusCode = error instanceof ZodError ? 400 : 500;

    res.status(statusCode).json({
      message,
    });
  }
};
