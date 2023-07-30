import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { EidLevel, EmailService } from "../email";
import UserService from "../../routes/users/user.service";

const EIDMiddleware = function (level: EidLevel) {
  return middleware(async (opts) => {
    const { email, code } = opts.ctx.eid;
    if (!email || !code) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid EID' });
  
    const eidData = EmailService.GetEid(email, code);
    if (eidData?.eid.level !== level) throw new TRPCError({ code: 'UNAUTHORIZED', message: `Level ${level} EID required. Got '${eidData?.eid.level}' instead` });
  
    return opts.next({
      ctx: {
        eid: {
          email,
          code,
          isUser: !!await UserService.GetUser({ where: { email } })
        }
      }
    })
  })
}

export default EIDMiddleware