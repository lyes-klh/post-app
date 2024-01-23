import { apiConfig } from "./api-config";
import { PostSchema } from "@/services/validation";
import type { PostType, PostFormType } from "@/services/validation";
import type { ApiResponse } from "./api-types";

export const getPosts = async (): Promise<PostType[]> => {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/posts`, {
      method: "GET",
      headers: apiConfig.headers,
    });

    const data: ApiResponse<PostType[]> = await response.json();
    return PostSchema.array().parse(data.data);
  } catch (error) {
    throw new Error("Something went wrong when fetching posts...");
  }
};

export const createPost = async (post: PostFormType): Promise<PostType> => {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/posts`, {
      method: "POST",
      headers: apiConfig.headers,
      body: JSON.stringify(post),
    });

    const data: ApiResponse<PostType> = await response.json();

    return data.data;
  } catch (error) {
    throw new Error("Something went wrong when creating the post...");
  }
};
