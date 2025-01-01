import useAuth from "../../hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner.tsx";

const Guest = () => {
  const { status } = useAuth();
  const isLoggedIn = status === "authenticated";

  const busy = status === "busy";

  if (busy) {
    return <LoadingSpinner verify={true} />;
  }

  return isLoggedIn ? <Navigate to={"/sign-up"} /> : <Outlet />;
};

export default Guest;
