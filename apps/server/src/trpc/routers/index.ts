import { publicProcedure, router } from '../trpc';
import { postRouter } from './posts';

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => {
    return { message: 'Hello world' };
  }),
  posts: postRouter,
});

export type AppRouter = typeof appRouter;
