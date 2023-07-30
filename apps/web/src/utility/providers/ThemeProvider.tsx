import { Accessor, JSX, Setter, Show, createContext, createResource, createSignal, useContext } from "solid-js";

function ThemeProvider (props: {
  children?: JSX.Element | JSX.Element[]
}) {
  const [ themeList ] = createResource(getThemeList);

  const [ theme, setTheme ] = createSignal<string>(localStorage.getItem('theme') || '');

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      <Show when={!themeList.loading} fallback={<>Loading...</>}>
        {props.children}
      </Show>
    </ThemeProviderContext.Provider>
  )
}

export default ThemeProvider;

interface IThemeProviderContext {
  theme: Accessor<string>
  setTheme: Setter<string>
}

export const ThemeProviderContext = createContext<IThemeProviderContext>();

export function useThemeProvider () {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("Cannot find a ThemeProviderContext");
  return context;
};

async function getThemeList () {
  const res = await fetch('themes/_list.json');
  if (!res.ok) console.error(`Couldn't retreive theme list`);

  const themes = await res.json() as {
    [K in string]: {
      background: string,
      text: string
    }
  }

  return themes;
}

async function getTheme (id: string) {
  const res = await fetch(`themes/${id}`);
  if (!res.ok) console.error(`Couldn't retreive theme with id '${id}'`);

  return await res.text();
}