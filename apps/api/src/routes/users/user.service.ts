import { DB, prisma } from "../../utility/prisma";

namespace UserService {
  export async function GetUser<T extends DB.Prisma.UserFindUniqueArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.UserFindUniqueArgs>
  ) {
    try {
      return await prisma.user.findUnique(args);
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