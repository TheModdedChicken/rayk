import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server';
import requestIp from 'request-ip';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { EmailService } from './email';

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  function getIP () {
    const ip = requestIp.getClientIp(req);
    if (!ip) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Couldn't retrieve IP address" })
    return ip;
  }

  return {
    eid: EmailService.ParseEidHeader(req.headers['eid'] as (string | undefined) || ''),
    ip: getIP()
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const middleware = t.middleware;
export const defaultProcedure = t.procedure;