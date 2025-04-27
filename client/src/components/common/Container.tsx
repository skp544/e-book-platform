import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.tsx";

interface Props {
  children: ReactNode;
}

const Container: FC<Props> = ({ children }) => {
  const location = useLocation();
  const readingMode = location.pathname.startsWith("/read/");

  if (readingMode) {
    return children;
  }
  return (
    <div className={"mx-auto flex min-h-screen max-w-5xl flex-col"}>
      <Navbar />
      <div className={"flex flex-1 flex-col"}>{children}</div>
    </div>
  );
};
export default Container;
