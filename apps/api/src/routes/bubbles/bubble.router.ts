import { defaultProcedure, router } from "../../utility/trpc";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import UserService from "../users/user.service";
import AuthMiddleware from "../../utility/middleware/auth";
import { BubbleRegex } from "../../utility/regex";
import BubbleService from "./bubble.service";
import { DB } from "../../utility/prisma";
import AuthService from "../auth/auth.service";

const BubbleSelect = z.object({
  name: z.boolean().optional(),
  id: z.boolean().optional(),
  created: z.boolean().optional(),
  visibility: z.boolean().optional(),
  user_id: z.boolean().optional(),
})

export const bubbleRouter = router({
  getBubble: defaultProcedure.use(AuthMiddleware(false))
  .input(z.object({ 
    bid: z.string(), // Takes in a bubble ID, however, add "#" to the start to search via bubble name.
    select: BubbleSelect
  }))
  .query(async (opts) => {
    const { 
      ctx: { user: authUser }, 
      input: { bid, select } 
    } = opts;

    const bubble = await BubbleService.FindFirstBubble({ 
      where: BubbleService.GenerateWhereByID(bid), 
      select: {
        ...select,
        id: true,
        user_id: true,
        visibility: true
      }
    });
    if (!bubble) throw new TRPCError({ code: 'NOT_FOUND', message: "Couldn't find specified bubble" });

    const isAuthUser = authUser ? bubble.user_id === authUser.id : false;

    if (!isAuthUser && bubble.visibility === 'PRIVATE') throw new TRPCError({ code: 'FORBIDDEN', message: "Requested bubble is private" });

    return {
      id: select.id ? bubble.id : undefined,
      name: select.name ? bubble.name : undefined,
      created: select.created ? bubble.created : undefined,
      visibility: select.visibility ? bubble.visibility : undefined,
      user_id: select.user_id ? AnonBubbleGuard(bubble.visibility, isAuthUser, bubble.user_id) : undefined
    }
  }),

  getBubblesFromUser: defaultProcedure.use(AuthMiddleware(false))
  .input(z.object({
    uid: z.string().optional(), // Takes in a bubble ID, however, add "@" to the start to search via bubble name.
    select: BubbleSelect
  }))
  .query(async (opts) => {
    const { 
      ctx: { user: authUser }, 
      input: { uid, select } 
    } = opts;

    if (!uid && !authUser) throw new TRPCError({ code: 'BAD_REQUEST', message: "A valid user ID was not provided" });

    const user = await UserService.FindFirstUser({ 
      where: UserService.GenerateWhereByID(uid || authUser.id),
      select: {
        id: true,
        bubbles: {
          select: {
            ...select,
            id: true,
            user_id: true,
            visibility: true
          }
        }
      }
    });
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: "Couldn't find specified bubble" });

    const isAuthUser = authUser ? user.id === authUser.id : false;

    return user.bubbles.filter((b) => !isAuthUser && b.visibility === 'PRIVATE' ? false : true).map((b) => {
      return {
        id: select.id ? b.id : undefined,
        name: select.name ? b.name : undefined,
        created: select.created ? b.created : undefined,
        visibility: select.visibility ? b.visibility : undefined,
        user_id: select.user_id ? AnonBubbleGuard(b.visibility, isAuthUser, b.user_id) : undefined
      }
    })
  }),

  createBubble: defaultProcedure.use(AuthMiddleware(true))
  .input(z.object({
    name: z.string().regex(BubbleRegex),
    visibility: z.nativeEnum(DB.BubbleVisibility)
  }))
  .query(async (opts) => {
    const { 
      ctx: { user: authUser }, 
      input: { name, visibility } 
    } = opts;

    if (await BubbleService.FindFirstBubble({ 
      where: { 
        name: { 
          mode: 'insensitive', 
          equals: name 
        } 
      } 
    })) throw new TRPCError({ code: 'CONFLICT', message: "Bubble name taken" });

    const bubble = await BubbleService.CreateBubble({
      data: {
        id: AuthService.CreateSnowflake().toString(),
        name,
        visibility,
        user: { connect: { id: authUser.id } }
      }
    })
    if (!bubble) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Couldn't create bubble" });

    return {
      id: bubble.id,
      name: bubble.name,
      created: bubble.created,
      visibility: bubble.visibility,
      user_id: bubble.user_id
    }
  })
})

function AnonBubbleGuard<T> (visibility: DB.BubbleVisibility, isOwner: boolean, value: T) {
  return (visibility === 'ANON'
    ? (
      isOwner 
      ? value
      : undefined
    )
    : value
  )
}