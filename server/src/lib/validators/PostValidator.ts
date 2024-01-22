import { z } from "zod";

export const PostSchema = z.object({
  username: z.string(),
  title: z.string(),
  content: z.string(),
});

export type PostType = z.infer<typeof PostSchema>;
