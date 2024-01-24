import { apiConfig } from "./api-config";
import { PostSchema } from "@/services/validation";
import type { Post, PostForm } from "@/services/validation";
import type { ApiResponse, ErrorResponse } from "./api-types";

export const getPosts = async ({ pageParam }: { pageParam: number }): Promise<Post[]> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts?page=${pageParam}`, {
    method: "GET",
    headers: apiConfig.headers,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const data: ApiResponse<Post[]> = await response.json();
  return PostSchema.array().parse(data.data);
};

export const createPost = async (post: PostForm): Promise<Post> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts`, {
    method: "POST",
    headers: apiConfig.headers,
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const data: ApiResponse<Post> = await response.json();
  return PostSchema.parse(data.data);
};

export const updatePost = async (id: string, post: Partial<PostForm>): Promise<Post> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts/${id}`, {
    method: "PATCH",
    headers: apiConfig.headers,
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw Error(error.message);
  }

  const data: ApiResponse<Post> = await response.json();
  return PostSchema.parse(data.data);
};

export const deletePost = async (id: string): Promise<void> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts/${id}`, {
    method: "DELETE",
    headers: apiConfig.headers,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
};
