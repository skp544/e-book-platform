import useAuth from "../../hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";

const Author = () => {
  const { profile } = useAuth();
  const isAuthor = profile?.role === "author";

  return isAuthor ? <Outlet /> : <Navigate to={"/not-found"} />;
};

export default Author;
