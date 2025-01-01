import useAuth from "../hooks/useAuth.ts";
import { Avatar, Button } from "@nextui-org/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

const Profile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return <Navigate to={"/sign-up"} />;
  }

  const { role } = profile;

  const isAuthor = role === "author";

  return (
    <div className={"flex flex-1 flex-col items-center "}>
      <div className={"flex min-w-96"}>
        <Avatar
          className={"w-20 h-20"}
          radius={"sm"}
          name={profile?.name}
          src={profile?.avatar}
        />
        <div className={"pl-4  flex-1"}>
          <p className={"text-xl font-semibold"}> {profile?.name}</p>
          <p>{profile?.email}</p>
          <div className={"flex justify-between items-center"}>
            <p>
              Role:{" "}
              <span className={"uppercase italic text-sm"}>
                {profile?.role}
              </span>
            </p>
            {!isAuthor ? (
              <Link className={"text-xs underline"} to={"/author-registration"}>
                Became an author
              </Link>
            ) : (
              <Link className={"text-xs underline"} to={"/update-author"}>
                Update Author Bio
              </Link>
            )}
          </div>
        </div>
        <Button
          className={"ml-auto"}
          onPress={() => navigate("/update-profile")}
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
