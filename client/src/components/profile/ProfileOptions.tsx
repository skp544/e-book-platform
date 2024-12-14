import { FC } from "react";
import { Button, Spinner } from "@nextui-org/react";
import ProfileMenu from "./ProfileMenu.tsx";
import {Link} from "react-router-dom";

interface Props {
  busy?: boolean;
  profile?: any;
}

const ProfileOptions: FC<Props> = ({ profile, busy }) => {
  if (busy) return <Spinner size={"sm"} />;

  return profile ? (
    <ProfileMenu />
  ) : (
    <Button as={Link} to={"sign-up"} variant={"bordered"}>Sign Up / In</Button>
  );
};

export default ProfileOptions;
