import NewUserForm from "../components/profile/NewUserForm.tsx";
import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth.ts";
import { updateProfileApi } from "../apis/auth.ts";
import { addToast } from "@heroui/react";
import { updateProfile } from "../redux/slices/authSlice.ts";

const UpdateProfile = () => {
  const { profile } = useAuth();
  const dispatch = useDispatch();

  const handleSubmit = async (formData: FormData) => {
    const response = await updateProfileApi(formData);

    if (!response.success) {
      addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
      return;
    }
    dispatch(updateProfile(response.data));
    addToast({
      color: "success",
      title: "Updated",
      description: response.message,
    });
  };

  return (
    <NewUserForm
      name={profile?.name}
      avatar={profile?.avatar}
      onSubmit={handleSubmit}
      title={"Update Profile"}
      btnTitle={"Update Profile"}
    />
  );
};
export default UpdateProfile;
