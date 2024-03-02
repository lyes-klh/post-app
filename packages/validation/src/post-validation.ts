import { z } from 'zod';

export const PostFormSchema = z.object({
  title: z.string().min(1, {
    message: 'Title must be at least 1 charecters',
  }),
  content: z
    .string()
    .min(2, {
      message: 'Content must be at least 2 characters.',
    })
    .max(10000, {
      message: 'Content must not be longer than 10000 characters.',
    }),
});

export type TPostForm = z.infer<typeof PostFormSchema>;
