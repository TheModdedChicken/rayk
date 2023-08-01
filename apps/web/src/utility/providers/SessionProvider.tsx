import { Accessor, JSX, Resource, Setter, createContext, createResource, createSignal, useContext } from "solid-js";
import { RouterOutput, trpc } from "../trpc";

const session = () => localStorage.getItem('session');
const setSession = (token: string) => localStorage.setItem('session', token);

function SessionProvider (props: {
  children?: JSX.Element | JSX.Element[]
}) {
  const [ sensitivePages, updateSensitivePages ] = createSignal<string[]>([]);
  const [ user, { refetch: refetchUser }] = createResource(async () => await trpc.users.getUser.query({ select: {
    id: true,
    username: true,
    email: true
  } }))

  return (
    <SessionProviderContext.Provider value={{ 
      session, 
      setSession(token) { setSession(token); refetchUser() }, 
      isPageSensitive() { return sensitivePages().includes(location.pathname) },
      sensitivePages() { return sensitivePages() }, 
      updateSensitivePages(value: string[]) { return updateSensitivePages(value) },

      user,
      refetchUser
    }}>
      {props.children}
    </SessionProviderContext.Provider>
  )
}

export default SessionProvider;

interface ISessionProviderContext {
  session: typeof session
  setSession: typeof setSession
  isPageSensitive: () => boolean
  sensitivePages: () => string[]
  updateSensitivePages: (value: string[]) => string[]

  user: Resource<RouterOutput['users']['getUser']>
  refetchUser: () => any
}

export const SessionProviderContext = createContext<ISessionProviderContext>();

export function useSessionProvider () {
  const context = useContext(SessionProviderContext);
  if (!context) throw new Error("Cannot find a SessionProviderContext");
  return context;
};