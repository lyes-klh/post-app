import { User } from '@post-app/database';
import { TRPCError, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export function createContext(opts: CreateExpressContextOptions) {
  const { req, res } = opts;

  const user = req.user as User | undefined;
  return { user, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.user)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not logged in, please login to continue.',
    });

  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
