import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@post-app/server/src/trpc';
export const trpc = createTRPCReact<AppRouter>();
