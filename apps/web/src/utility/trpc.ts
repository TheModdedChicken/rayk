import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'api/src';

let eid: string;

export function SetEIDHeader (email: string, code: string) {
  eid = `email=${email} code=${code}`;
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:5656',
      headers() {
        return {
          Authorization: localStorage.getItem('session') || '',
          eid
        }
      }
    }),
  ],
});

interface TRPCErrorData {
  message: string,
  code: number,
  data: {
    code: string,
    httpStatus: number,
    stack: any,
    path: string
  }
}

export function CatchTRPCError<T extends Object> (
  data: T, 
  callback: (data: TRPCErrorData) => any
) {
  if ('error' in data) return callback({ ...data.error as TRPCErrorData });
  else return data;
}