import Post from '@/models/postModel';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { PostFormSchema, PostType } from '@post-app/validation';

export const postRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const post = await Post.findById(input.id);
      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });

      return post as PostType;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const cursor = input.cursor ?? 1;
      const limit = input.limit ?? 5;

      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip((cursor - 1) * limit)
        .limit(limit);

      return posts as PostType[];
    }),

  create: publicProcedure.input(PostFormSchema).mutation(async ({ input }) => {
    const post = await Post.create(input);

    return post as PostType;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        post: PostFormSchema.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const post = await Post.findByIdAndUpdate(input.id, input.post, { new: true });
      return post as PostType;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const post = await Post.findById(input.id);

      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });

      await post.deleteOne();
    }),

  like: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const post = await Post.findById(input.id);

      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });

      post.likesCount++;

      const updatedPost = await post.save();

      return updatedPost as PostType;
    }),

  comment: publicProcedure
    .input(z.object({ id: z.string(), comment: z.string() }))
    .mutation(async ({ input }) => {
      const post = await Post.findById(input.id);

      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });

      post.comments.push(input.comment);

      const updatedPost = await post.save();

      return updatedPost as PostType;
    }),
});
