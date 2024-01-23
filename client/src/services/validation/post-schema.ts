import { z } from "zod";

export const PostSchema = z.object({
  _id: z.string(),
  username: z.string().min(2, {
    message: "Username must be at least 2 charecters",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 charecters",
  }),
  content: z
    .string()
    .min(10, {
      message: "Content must be at least 10 characters.",
    })
    .max(300, {
      message: "Content must not be longer than 30 characters.",
    }),
});

export const PostFormSchema = PostSchema.omit({ _id: true });

export type PostType = z.infer<typeof PostSchema>;
export type PostFormType = z.infer<typeof PostFormSchema>;
