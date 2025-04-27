import useAuth from "../../hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@heroui/react";

const Author = () => {
  const { profile, status } = useAuth();
  const isAuthor = profile?.role === "author";

  if (status === "busy") return <Spinner size={"sm"} />;

  return isAuthor ? <Outlet /> : <Navigate to={"/not-found"} />;
};

export default Author;
