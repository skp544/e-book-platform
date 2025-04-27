import useAuth from "../hooks/useAuth.ts";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Avatar, Button, Spinner } from "@heroui/react";
import { BsPencilSquare } from "react-icons/bs";

const Profile = () => {
  const { profile, status } = useAuth();

  const navigate = useNavigate();

  if (status === "busy") {
    return <Spinner size="sm" />;
  }

  if (!profile || status === "unauthenticated") {
    return <Navigate to={"/sign-up"} />;
  }

  const { role } = profile;

  const isAuthor = role === "author";

  return (
    <div className={"mt-20 flex flex-1 flex-col items-center"}>
      <div className={"flex min-w-96"}>
        <Avatar
          className={"h-20 w-20"}
          radius={"sm"}
          name={profile?.name}
          src={profile?.avatar}
        />

        <div className={"flex-1 pl-4"}>
          <p className={"text-xl font-semibold"}> {profile?.name}</p>
          <p>{profile?.email}</p>
          <div className={"flex items-center justify-between"}>
            <p>
              Role:{" "}
              <span className={"text-sm uppercase italic"}>
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
