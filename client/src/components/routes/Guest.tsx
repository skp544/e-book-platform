import useAuth from "../../hooks/useAuth.ts";
import LoadingSpinner from "../common/LoadingSpinner.tsx";
import { Navigate, Outlet } from "react-router-dom";

const Guest = () => {
  const { status } = useAuth();

  const busy = status === "busy";

  if (busy) {
    return <LoadingSpinner verify={true} />;
  }

  const isLoggedIn = status === "authenticated";

  console.log(isLoggedIn, "isLoggedIn");

  return !isLoggedIn ? <Navigate to={"/sign-up"} /> : <Outlet />;
};
export default Guest;
