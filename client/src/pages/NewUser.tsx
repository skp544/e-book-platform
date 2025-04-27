import { addToast } from "@heroui/react";
import { updateProfileApi } from "../apis/auth.ts";
import { Navigate, useNavigate } from "react-router-dom";
import NewUserForm from "../components/profile/NewUserForm.tsx";
import useAuth from "../hooks/useAuth.ts";

const NewUser = () => {
  const { profile, updateProfileInfo } = useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (formData: FormData) => {
    const response = await updateProfileApi(formData);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }
    await updateProfileInfo();
    navigate("/");
    addToast({
      color: "success",
      title: "Welcome!!",
      description: response.message,
    });
  };

  if (profile?.signedUp) {
    return <Navigate to={"/"} />;
  }

  return (
    <NewUserForm
      onSubmit={handleSubmit}
      title={"You are almost there, Please fill out the details below."}
      btnTitle={"Sign Me Up"}
    />
  );
};
export default NewUser;
