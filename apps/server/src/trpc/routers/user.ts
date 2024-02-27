import UserModel from '@/models/userModel';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { passport } from '../../passport';
import { Types } from 'mongoose';

const userSchema = z.object({
  _id: z.coerce.string().refine((value) => {
    return Types.ObjectId.isValid(value);
  }),
  email: z.string().email(),
  username: z.string(),
});

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
      const user = await UserModel.findOne({ email: input.email });
      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Account already exist`,
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const newUser = await UserModel.create({ ...input, password: hashedPassword });

      await new Promise((resolve) => opts.ctx.req.login(newUser, () => resolve(null)));

      const userParsed = userSchema.safeParse(newUser);
      if (userParsed.success) return userParsed.data;
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
          passport.authenticate('custom')(ctx.req, ctx.res, (err: Error, user: Express.User) => {
            if (err) return reject(err);
            resolve(user);
          });
        });
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          // message: 'Authentication Failed',
          message: err.message,
        });
      }

      const user = await UserModel.findOne({ email: input.email });

      const userParsed = userSchema.safeParse(user);
      if (userParsed.success) return userParsed.data;
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
    if (opts.ctx.user) {
      const user = await UserModel.findById(opts.ctx.user?._id);

      const userParsed = userSchema.safeParse(user);
      if (userParsed.success) return userParsed.data;
      else return null;
    } else return null;
  }),
});
