import { Navigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/authSlice.ts";
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const profileInfoString = searchParams.get("profile");

  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);
      if (!profile.signedUp) {
        return <Navigate to={"/new-user"} />;
      }

      dispatch(updateProfile(profile));

      return <Navigate to={"/"} />;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return <Navigate to={"/not-found"} />;
    }
  }

  return <LoadingSpinner verify={true} />;
};

export default Verify;
