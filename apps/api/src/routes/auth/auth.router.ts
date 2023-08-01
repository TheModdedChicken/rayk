import { EmailService } from "../../utility/email";
import { defaultProcedure, router } from "../../utility/trpc";
import { z } from 'zod';
import AuthService from "./auth.service";
import EIDMiddleware from "../../utility/middleware/eid";
import { TRPCError } from "@trpc/server";
import { UsernameRegex } from "../../utility/regex";
import UserService from "../users/user.service";
import AuthMiddleware from "../../utility/middleware/auth";


export const authRouter = router({
  accessKey: defaultProcedure
  .input(z.object({ key: z.string() }))
  .query(async ({ input: { key } }) => {
    const data = await AuthService.GetAccessKey({ where: { key } });

    return {
      valid: !!data
    }
  }),

  eid: defaultProcedure
  .input(z.object({ email: z.string().email().toLowerCase(), level: z.number().min(1).max(2) }))
  .query(async ({ input: { email, level } }) => {
    const eid_data = await EmailService.CreateEid(email, level);
    if (!eid_data) throw new Error("Failed to create EID")

    return {
      ...eid_data,
      message: `Verification code sent to ${email}`
    }
  }),

  signup: defaultProcedure.use(EIDMiddleware(2))
  .input(z.object({ username: z.string().regex(UsernameRegex), key: z.string() }))
  .mutation(async (opts) => {
    const { 
      ctx: { eid: { email, code, isUser }, ip }, 
      input: { username, key } 
    } = opts;

    if (!await AuthService.GetAccessKey({ where: { key } })) throw new TRPCError({ code: 'UNAUTHORIZED', message: "Invalid access key" });
    if (isUser) throw new TRPCError({ code: 'CONFLICT', message: "Email is taken" });
    if (
      await UserService.FindFirstUser({ 
        where: { 
          username: {
            equals: username,
            mode: 'insensitive'
          }
        }
      })
    ) throw new TRPCError({ code: 'CONFLICT', message: "Username is taken" });

    const user = await UserService.CreateUser({
      email,
      username,
      id: AuthService.CreateSnowflake().toString()
    })

    const token = await AuthService.CreateSession(user.id, ip);

    await AuthService.DeleteAccessKey({ key });
    EmailService.DeleteEid(email, code);

    return {
      email: user.email,
      username: user.username,
      id: user.id,
      token
    }
  }),

  login: defaultProcedure.use(EIDMiddleware(2))
  .mutation(async (opts) => {
    const { eid: { email }, ip } = opts.ctx;

    const user = await UserService.FindUser({ where: { email }, include: { sessions: true } });
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });

    if (user.sessions.length >= 5) await AuthService.DeleteSession({ token: user.sessions[0].token });

    const token = await AuthService.CreateSession(user.id, ip);

    return { token };
  }),

  logout: defaultProcedure.use(AuthMiddleware(true))
  .mutation(async (opts) => {
    await AuthService.DeleteSession({ token: opts.ctx.authorization });
    return;
  })
})