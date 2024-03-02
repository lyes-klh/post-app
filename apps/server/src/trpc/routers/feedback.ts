import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { userSelect } from './user';

export const feedbackRouter = router({
  likes: router({
    create: protectedProcedure
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

        const like = await prisma.like.findFirst({
          where: {
            postId: post.id,
            userId: ctx.user.id,
          },
        });

        if (like)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You already liked this post.',
          });

        await prisma.like.create({
          data: {
            userId: ctx.user.id,
            postId: post.id,
          },
        });

        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            likesCount: post.likesCount + 1,
          },
        });
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

        const like = await prisma.like.findFirst({
          where: {
            postId: post.id,
            userId: ctx.user.id,
          },
        });

        if (!like)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You did not like this post.',
          });

        await prisma.like.delete({
          where: {
            id_postId_userId: {
              id: like.id,
              postId: post.id,
              userId: ctx.user.id,
            },
          },
        });

        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            likesCount: post.likesCount - 1,
          },
        });
      }),
  }),

  comments: router({
    create: protectedProcedure
      .input(z.object({ postId: z.string(), content: z.string() }))
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

        const comment = await prisma.comment.create({
          data: {
            postId: post.id,
            userId: ctx.user.id,
            content: input.content,
          },
        });

        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            commentsCount: post.commentsCount + 1,
          },
        });

        return comment;
      }),

    getAll: protectedProcedure
      .input(
        z.object({
          postId: z.string(),
          limit: z.number().min(1).max(50).nullish(),
          cursor: z
            .object({
              createdAt: z.string(),
              id: z.string(),
            })
            .nullish(),
        }),
      )
      .query(async ({ input }) => {
        const limit = input.limit ?? 5;
        let cursor: { id: string; createdAt: Date } | undefined = undefined;

        if (input.cursor)
          cursor = { id: input.cursor.id, createdAt: new Date(input.cursor.createdAt) };

        const comments = await prisma.comment.findMany({
          take: limit + 1,
          cursor,
          where: {
            postId: input.postId,
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          include: {
            user: {
              select: userSelect,
            },
          },
        });

        let nextCursor: typeof cursor = undefined;

        if (comments.length > limit) {
          const nextItem = comments.pop();
          nextCursor = { id: nextItem!.id, createdAt: nextItem!.createdAt };
        }

        return {
          comments,
          nextCursor,
        };
      }),

    delete: protectedProcedure
      .input(
        z.object({
          commentId: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const comment = await prisma.comment.findUnique({
          where: {
            id: input.commentId,
          },
        });

        if (!comment)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'This comment does not exist.',
          });

        if (comment.userId !== ctx.user.id)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: "You can't delete this comment.",
          });

        const post = await prisma.post.findUnique({
          where: {
            id: comment.postId,
          },
        });

        if (!post)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'The post does not exist.',
          });

        await prisma.comment.delete({
          where: {
            id: comment.id,
          },
        });

        await prisma.post.update({
          where: {
            id: comment.postId,
          },
          data: {
            commentsCount: post.commentsCount - 1,
          },
        });
      }),
  }),
});
