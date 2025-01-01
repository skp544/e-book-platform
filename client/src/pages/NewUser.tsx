import { updateProfileApi } from "../apis/auth.ts";
import toast from "react-hot-toast";
import NewUserForm from "../components/profile/NewUserForm.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

function NewUser() {
  const { profile } = useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (formData: FormData) => {
    const response = await updateProfileApi(formData);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    navigate("/");
    toast.success(response.message);
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
}

export default NewUser;
