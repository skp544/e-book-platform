import useAuth from "../../hooks/useAuth.ts";
import LoadingSpinner from "../common/LoadingSpinner.tsx";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
  const { status } = useAuth();
  const notLoggedIn = status === "unauthenticated";

  const busy = status === "busy";

  if (busy) {
    return <LoadingSpinner verify={true} />;
  }

  return notLoggedIn ? <Navigate to={"/sign-up"} /> : <Outlet />;
};
export default Private;
