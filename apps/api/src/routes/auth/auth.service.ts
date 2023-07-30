import { Snowflake } from "nodejs-snowflake";
import env from "../../utility/env";
import { DB, prisma } from "../../utility/prisma";
import * as jwt from 'jsonwebtoken';
import UserService from "../users/user.service";

namespace AuthService {
  export async function GetAccessKey<T extends DB.Prisma.AccessKeyFindUniqueArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.AccessKeyFindUniqueArgs>
  ) {
    try {
      return await prisma.accessKey.findUnique(args);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function DeleteAccessKey (
    where: DB.Prisma.AccessKeyWhereUniqueInput
  ): Promise<DB.AccessKey | null> {
    try {
      return prisma.accessKey.delete({ where });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export function CreateSnowflake () {
    return new Snowflake({ custom_epoch: parseInt(env.SNOWFLAKE_EPOCH) }).getUniqueID();
  }

  export async function CreateSession(userID: string, ip: string): Promise<string> {
    const token = jwt.sign(
      { 
        id: userID, 
        ip 
      }, 
      env.AUTH_SECRET,
      { expiresIn: '30d' }
    );

    await UserService.UpdateUser({ 
      where: { id: userID },
      data: {
        sessions: {
          create: {
            token,
            ip,
            expires: new Date(Date.now() + 2592000000)
          }
        }
      }
    });

    return token;
  }

  export async function DeleteSession (where: DB.Prisma.SessionWhereUniqueInput): Promise<DB.Session> {
    return await prisma.session.delete({ where });
  }
}

export default AuthService