import { Resolver, TRPCClientError, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'api/src';

let eid: string;

export function SetEIDHeader (email: string, code: string) {
  eid = `email=${email} code=${code}`;
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: ['localhost', '127.0.0.1'].includes(location.hostname) || location.hostname.startsWith('192.168.')
        ? 'http://' + location.hostname + ':5656/trpc'
        : location.protocol + '//api.' + location.origin + '/trpc',
      headers() {
        return {
          Authorization: localStorage.getItem('session') || '',
          eid
        }
      }
    }),
  ]
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export interface TRPCErrorData {
  message: string,
  code: number,
  data: {
    code: string,
    httpStatus: number,
    stack: any,
    path: string
  }
}

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export async function tryFail<T>(
  f: (() => Promise<T>) | (() => T)
): Promise<T | TRPCClientError<AppRouter>> {
  try {
    return await f()
  } catch (e) {
    if (isTRPCClientError(e)) return e;
    else throw e;
  }
}

export async function TRPCHandle<T extends (...args: Parameters<T>) => ReturnType<T>> (call: T, ...args: Parameters<T>) {
  const data = await tryFail(async () => await call(...args));
  if (!isTRPCClientError(data)) return data;
  return data;
}