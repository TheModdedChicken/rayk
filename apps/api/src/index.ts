import path from 'path';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
config({ path: path.join(__dirname, '../.env') })

import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, defaultProcedure, router } from './utility/trpc';
import { authRouter } from './routes/auth/auth.router';
import env from './utility/env';
import { userRouter } from './routes/users/user.router';
import { bubbleRouter } from './routes/bubbles/bubble.router';

const appRouter = router({
  auth: authRouter,

  bubbles: bubbleRouter,

  users: userRouter,

  ping: defaultProcedure.query(() => {
    return 'Pong!'
  })
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors({ origin: true }));
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext
}))

app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}`));