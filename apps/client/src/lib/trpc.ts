import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@post-app/server/src/trpc';
import type { inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>();

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type TPostList = RouterOutputs['posts']['getAll']['posts'];
export type TPost = TPostList[number];
export type TCommentList = RouterOutputs['posts']['feedback']['comments']['getAll']['comments'];
export type TComment = TCommentList[number];
