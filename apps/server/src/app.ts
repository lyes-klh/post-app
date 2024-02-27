import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from './trpc';
import { passport } from './passport';

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Session
// const store = MongoStore.create({ mongoUrl: process.env.DB_URL as string });

app.use(
  session({
    secret: 'SECRET_COOKIE',
    resave: false,
    saveUninitialized: false,
    // store,
    cookie: {
      domain: 'localhost',
      maxAge: 30 * 24 * 3600 * 1000,
      secure: false,
      httpOnly: true,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get('/', (_req, res) => res.send('hello'));

export default app;
