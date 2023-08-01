import { trpc } from "../trpc"

namespace Users {
  type GetUserQueryParams = Parameters<typeof trpc.users.getUser.query>[0];
  type GetUserQueryId = GetUserQueryParams['id'];
  type GetUserQuerySelect = GetUserQueryParams['select'];

  export async function getUserData (id: GetUserQueryId, select: GetUserQuerySelect) {
    return trpc.users.getUser.query({ id, select })
  }
}

export default Users