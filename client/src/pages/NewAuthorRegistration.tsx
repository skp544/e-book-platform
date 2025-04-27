import AuthorForm from "../components/author/AuthorForm.tsx";
import { AuthorInfo } from "../types";
import { registerAuthorApi } from "../apis/author.ts";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

const NewAuthorRegistration = () => {
  const { updateProfileInfo } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (formData: AuthorInfo) => {
    const response = await registerAuthorApi(formData);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    await updateProfileInfo();
    addToast({
      color: "success",
      title: "Registered",
      description: response.message,
    });
    navigate("/profile");
  };

  return <AuthorForm onSubmit={handleSubmit} btnTitle={"Became an author"} />;
};
export default NewAuthorRegistration;
