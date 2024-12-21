import { Navigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

const Verify = () => {
  const [searchParams] = useSearchParams();

  const profileInfoString = searchParams.get("profile");

  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);
      if (!profile.signedUp) {
        return <Navigate to={"/new-user"} />;
      }

      return <Navigate to={"/"} />;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return <Navigate to={"/not-found"} />;
    }
  }

  return (
    <div className={"flex items-center justify-center p-10"}>
      <Spinner color="warning" label="Verifying..." />;
    </div>
  );
};

export default Verify;
