import { DB, exclude, prisma } from "../../utility/prisma";

namespace BubbleService {
  const BubbleExtension = prisma.$extends({
    model: {
      bubble: {

      }
    }
  })

  /**
   * Creates a unique 'where' object for finding bubbles
   * @param id Either a user ID or a (#)bubble name
   * @returns 
   */
  export function GenerateWhereByID (
    id: string,
  ) {
    let where: DB.Prisma.BubbleWhereInput;
    if (id.startsWith("#")) where = { name: { equals: id.slice(1, id.length), mode: 'insensitive' } } as DB.Prisma.BubbleWhereInput; // Bubble Name
    else where = { id }; // Bubble ID

    return where;
  }

  /*export function ExcludeFromBubble<T extends Partial<DB.Prisma.BubbleGetPayload<DB.Prisma.BubbleArgs>>, Key extends keyof T> (
    bubble: T,
    options?: {
      isOwner?: boolean,
      exclude?: Key[]
    }
  ) {
    if (options) {
      if (options.exclude) {
        const excludedBubble = exclude(bubble, options.exclude);
        return {
          ...excludedBubble,
        }
      }
    }
    
    return bubble;
  }*/

  export async function FindFirstBubble<T extends DB.Prisma.BubbleFindFirstArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.BubbleFindFirstArgs>
  ) {
    try {
      return await prisma.bubble.findFirst(args);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function CreateBubble<T extends DB.Prisma.BubbleCreateArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.BubbleCreateArgs>
  ) {
    return prisma.bubble.create(args);
  }

  export async function DeleteBubble<T extends DB.Prisma.BubbleDeleteArgs> (
    args: DB.Prisma.SelectSubset<T, DB.Prisma.BubbleDeleteArgs>
  ) {
    return prisma.bubble.delete(args);
  }
}

export default BubbleService