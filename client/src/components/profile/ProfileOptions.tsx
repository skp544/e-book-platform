import { Button, Spinner } from "@heroui/react";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu.tsx";
import useAuth from "../../hooks/useAuth.ts";

const ProfileOptions = () => {
  const { profile, status, signOut } = useAuth();

  if (status === "busy") return <Spinner size={"sm"} />;

  return profile ? (
    <ProfileMenu profile={profile} signOut={signOut} />
  ) : (
    <Button as={Link} to={"/sign-up"} variant={"bordered"}>
      Sign Up / In
    </Button>
  );
};

export default ProfileOptions;
