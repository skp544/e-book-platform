import { Navigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice.ts";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const profileInfoString = searchParams.get("profile");
  const dispatch = useDispatch();

  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);

      if (!profile.signedUp) {
        return <Navigate to={"/new-user"} />;
      }

      console.log("profile signedUp", profile);

      dispatch(updateProfile(profile));

      return <Navigate to={"/"} />;
    } catch (e) {
      return <Navigate to={"/not-found"} />;
    }
  }

  return (
    <div className={"flex items-center justify-center p-10"}>
      <Spinner label={"Verifying..."} color={"warning"} />
    </div>
  );
};
export default Verify;
