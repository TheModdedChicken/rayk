import { DB, prisma } from "../../utility/prisma";

namespace UserService {
  /**
   * Creates a unique 'where' object for finding users
   * @param id Either a user ID or a (@)username
   * @returns 
   */
  export function GenerateWhereByID (
    id: string,
  ) {
    let where: DB.Prisma.UserWhereInput;
    if (id.startsWith("@")) where = { username: { equals: id.slice(1, id.length), mode: 'insensitive' } } as DB.Prisma.UserWhereInput; // Username
    // else if (id.includes("@")) where = { email: id }; // Email
    else where = { id }; // User ID

    return where;
  }

  export async function FindUser<T extends DB.Prisma.UserFindUniqueArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.UserFindUniqueArgs>
  ) {
    try {
      return await prisma.user.findUnique(args);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function FindFirstUser<T extends DB.Prisma.UserFindFirstArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.UserFindFirstArgs>
  ) {
    try {
      return await prisma.user.findFirst(args);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function FindManyUsers<T extends DB.Prisma.UserFindManyArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.UserFindManyArgs>
  ) {
    try {
      return await prisma.user.findMany(args);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function CreateUser (
    data: DB.Prisma.UserCreateInput
  ): Promise<DB.User> {
    return prisma.user.create({
      data,
    });
  }

  export async function UpdateUser<T extends DB.Prisma.UserUpdateArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.UserUpdateArgs>
  ) {
    try {
      return prisma.user.update(args);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default UserService