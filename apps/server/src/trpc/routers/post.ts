import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { PostFormSchema } from '@post-app/validation';
import { prisma } from '@/lib/db';
import { userSelect } from './user';
import { feedbackRouter } from './feedback';

export const postRouter = router({
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: userSelect,
          },
          likes: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });

      return post;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z
          .object({
            createdAt: z.string(),
            id: z.string(),
          })
          .nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 5;
      let cursor: { id: string; createdAt: Date } | undefined = undefined;

      if (input.cursor)
        cursor = { id: input.cursor.id, createdAt: new Date(input.cursor.createdAt) };

      const posts = await prisma.post.findMany({
        take: limit + 1,
        cursor,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        include: {
          user: {
            select: userSelect,
          },
          likes: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = { id: nextItem!.id, createdAt: nextItem!.createdAt };
      }

      return {
        posts,
        nextCursor,
      };
    }),

  create: protectedProcedure.input(PostFormSchema).mutation(async ({ input, ctx }) => {
    const post = await prisma.post.create({
      data: {
        userId: ctx.user.id,
        ...input,
      },
    });

    return post;
  }),

  update: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        post: PostFormSchema.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found.',
        });

      if (post.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "You can't update this post.",
        });

      const updatedPost = await prisma.post.update({
        where: {
          id: input.postId,
        },
        data: input.post,
      });

      return updatedPost;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });

      if (post.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "You can't delete this post.",
        });

      await prisma.post.delete({
        where: {
          id: post.id,
        },
      });
    }),

  feedback: feedbackRouter,
});
