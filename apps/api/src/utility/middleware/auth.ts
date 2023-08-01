import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import UserService from "../../routes/users/user.service";
import AuthService from "../../routes/auth/auth.service";
import { User } from "@prisma/client";

const AuthMiddleware = function (required: boolean) {
  return middleware(async (opts) => {
    const auth = opts.ctx.authorization;

    if (auth) {
      const sessionData = AuthService.VerifyToken(auth);
      if (!sessionData) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid authorization token' });

      const user = await UserService.FindUser({ where: { id: sessionData.id } });
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid authorization token' });
    
      return opts.next({
        ctx: { user }
      })
    }
    else if (required && !auth) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid authorization token' });
    else return opts.next({ ctx: { user: null } });
  })
}

export default AuthMiddleware