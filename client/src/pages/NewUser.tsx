import { updateProfileApi } from "../apis/auth.ts";
import toast from "react-hot-toast";
import NewUserForm from "../components/profile/NewUserForm.tsx";

function NewUser() {
  const handleSubmit = async (formData: FormData) => {
    const response = await updateProfileApi(formData);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
  };

  return <NewUserForm onSubmit={handleSubmit} title={"You are almost there, Please fill out the details below."} />;
}

export default NewUser;
