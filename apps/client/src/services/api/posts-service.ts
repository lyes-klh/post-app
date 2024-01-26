import { apiConfig } from "./api-config";
import { PostSchema } from "@post-app/validation";
import type { PostType, PostFormType } from "@post-app/validation";
import type { ApiResponse, ErrorResponse } from "./api-types";

export const getPosts = async ({ pageParam }: { pageParam: number }): Promise<PostType[]> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts?page=${pageParam}`, {
    method: "GET",
    headers: apiConfig.headers,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const data: ApiResponse<PostType[]> = await response.json();
  return PostSchema.array().parse(data.data);
};

export const createPost = async (post: PostFormType): Promise<PostType> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts`, {
    method: "POST",
    headers: apiConfig.headers,
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const data: ApiResponse<PostType> = await response.json();
  return PostSchema.parse(data.data);
};

export const updatePost = async (id: string, post: Partial<PostFormType>): Promise<PostType> => {
  const response = await fetch(`${apiConfig.baseUrl}/posts/${id}`, {
    method: "PATCH",
    headers: apiConfig.headers,
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw Error(error.message);
  }

  const data: ApiResponse<PostType> = await response.json();
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
