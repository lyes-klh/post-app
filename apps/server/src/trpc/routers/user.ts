import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { passport } from '../../passport';
import { prisma } from '@/lib/db';
import { Prisma, User } from '@post-app/database';
import { feedbackRouter } from './feedback';

export const userSelect = {
  id: true,
  email: true,
  username: true,
} satisfies Prisma.UserSelect;

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Account already exist`,
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const newUser = await prisma.user.create({
        data: { ...input, password: hashedPassword },
        select: userSelect,
      });

      await new Promise((resolve) => opts.ctx.req.login(newUser, () => resolve(null)));

      return newUser;
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.req.body = input;

      try {
        await new Promise((resolve, reject) => {
          passport.authenticate('custom')(ctx.req, ctx.res, (err: Error, user: User) => {
            if (err) return reject(err);
            resolve(user);
          });
        });
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          // @ts-ignore
          message: err.message,
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
        select: userSelect,
      });

      if (user) return user;
      else
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User does not exist',
        });
    }),

  logout: protectedProcedure.mutation(async (opts) => {
    try {
      await new Promise((resolve) => opts.ctx.req.logout(() => resolve(null)));
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Logout failed. Please try again',
      });
    }
  }),

  me: protectedProcedure.query(async (opts) => {
    const user = await prisma.user.findUnique({
      where: {
        id: opts.ctx.user.id,
      },
      select: userSelect,
    });

    return user;
  }),
});
