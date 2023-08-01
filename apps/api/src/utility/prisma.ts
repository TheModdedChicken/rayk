import { Bubble, PrismaClient, User } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export * as DB from '@prisma/client';

export function exclude<T extends {}, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) delete obj[key];
  return obj;

  // return Object.fromEntries(
  //   Object.entries(obj).filter(([key]) => !keys.includes(key as Key))
  // )
}

// Omit<T, Key>