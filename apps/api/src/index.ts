import path from 'path';
import { config } from 'dotenv';
config({ path: path.join(__dirname, '../.env') })

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { createContext, defaultProcedure, router } from './utility/trpc';
import { authRouter } from './routes/auth/auth.router';
import env from './utility/env';

const appRouter = router({
  auth: authRouter,

  ping: defaultProcedure.query(() => {
    return 'Pong!'
  })
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  createContext
});

server.listen(env.PORT);

console.log(`Listening on port ${env.PORT}`)