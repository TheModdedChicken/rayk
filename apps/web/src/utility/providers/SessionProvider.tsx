import { JSX, createContext, useContext } from "solid-js";

const session = () => localStorage.getItem('session');
const setSession = (token: string) => localStorage.setItem('session', token);

function SessionProvider (props: {
  children?: JSX.Element | JSX.Element[]
}) {
  return (
    <SessionProviderContext.Provider value={{ session, setSession }}>
      {props.children}
    </SessionProviderContext.Provider>
  )
}

export default SessionProvider;

interface ISessionProviderContext {
  session: typeof session
  setSession: typeof setSession
}

export const SessionProviderContext = createContext<ISessionProviderContext>();

export function useSessionProvider () {
  const context = useContext(SessionProviderContext);
  if (!context) throw new Error("Cannot find a SessionProviderContext");
  return context;
};