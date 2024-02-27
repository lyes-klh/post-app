import { publicProcedure, router } from '../trpc';
import { postRouter } from './post';
import { userRouter } from './user';

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => {
    return { message: 'Hello world' };
  }),
  posts: postRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
