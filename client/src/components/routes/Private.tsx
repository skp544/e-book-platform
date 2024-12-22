import useAuth from "../../hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner.tsx";

const Private = () => {
  const { status } = useAuth();
  const notLoggedIn = status === "unauthenticated";

  const busy = status === "busy"

  if (busy) {
    return  <LoadingSpinner />
  }

  return notLoggedIn ? <Navigate to={"/sign-up"} /> : <Outlet />;
};

export default Private;
