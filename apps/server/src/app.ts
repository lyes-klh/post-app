import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.get('/', (_req, res) => res.send('hello'));

export default app;
