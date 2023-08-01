import { defaultProcedure, router } from "../../utility/trpc";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import UserService from "../users/user.service";
import AuthMiddleware from "../../utility/middleware/auth";

const UserSelect = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  email: z.boolean().optional(),
  
  joined: z.boolean().optional(),

  roles: z.boolean().optional(),
  permissions: z.boolean().optional(),

  starred: z.boolean().optional(),

  sessions: z.boolean().optional()
})


export const userRouter = router({
  getUser: defaultProcedure.use(AuthMiddleware(false))
  .input(z.object({ 
    id: z.string().optional(), // Takes in a user ID, however, add "@" to the start to search via username.
    select: UserSelect
  }))
  .query(async (opts) => {
    const { 
      ctx: { user: authUser }, 
      input: { id, select } 
    } = opts;

    if (!id && !authUser) throw new TRPCError({ code: 'BAD_REQUEST', message: "A valid user ID was not provided" });

    const user = await UserService.FindFirstUser({ 
      where: UserService.GenerateWhereByID(id || authUser.id),
      select: {
        ...select,
        id: true
      }
    });
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: "Couldn't find specified user" });

    const isAuthUser = authUser ? user.id === authUser.id : false;

    return {
      id: select.id ? user.id : undefined,
      username: select.username ? user.username : undefined,
      email: select.email && isAuthUser ? user.email : undefined,
      joined: select.joined ? user.joined : undefined,
      roles: select.roles && isAuthUser ? user.roles : undefined,
      permissions: select.permissions && isAuthUser ? user.permissions : undefined,
      starred: select.starred && isAuthUser ? user.starred : undefined,
      sessions: (select.sessions && isAuthUser
        ? (
          user.sessions?.length === 0
          ? user.sessions.map((s) => ({
            ip: s.ip,
            expires: s.expires
          }))
          : undefined
        )
        : undefined
      )
    }
  }),
})