import useAuth from "../hooks/useAuth.ts";
import { Avatar, Button } from "@nextui-org/react";
import { Navigate, useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

const Profile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return <Navigate to={"/sign-up"} />;
  }

  return (
    <div className={"flex flex-1 flex-col items-center "}>
      <div className={"flex min-w-96"}>
        <Avatar
          className={"w-20 h-20"}
          radius={"sm"}
          name={profile?.name}
          src={profile?.avatar}
        />
        <div className={"pl-4"}>
          <p className={"text-xl font-semibold"}> {profile?.name}</p>
          <p>{profile?.email}</p>
          <p>
            Role:{" "}
            <span className={"uppercase italic text-sm"}>{profile?.role}</span>
          </p>
        </div>
        <Button
          className={"ml-auto"}
          onClick={() => navigate("/update-profile")}
          variant={"flat"}
          isIconOnly
        >
          <BsPencilSquare size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
