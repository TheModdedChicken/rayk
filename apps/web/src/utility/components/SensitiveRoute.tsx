import { Route, RouteProps } from "@solidjs/router";
import { useSessionProvider } from "../providers/SessionProvider";

function SensitiveRoute<S extends string> (props: RouteProps<S>) {
  const { sensitivePages, updateSensitivePages } = useSessionProvider();

  return (
    <Route {...props} data={(d) => {
      updateSensitivePages([
        ...sensitivePages(),
        d.location.pathname
      ])
      if (props.data) return props.data(d);
    }}></Route>
  );
}

export default SensitiveRoute