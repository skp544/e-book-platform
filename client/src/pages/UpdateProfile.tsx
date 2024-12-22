import { updateProfileApi } from "../apis/auth.ts";
import toast from "react-hot-toast";
import NewUserForm from "../components/profile/NewUserForm.tsx";
import useAuth from "../hooks/useAuth.ts";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/authSlice.ts";

const UpdateProfile = () => {
  const { profile } = useAuth();
  const dispatch = useDispatch();

  const handleSubmit = async (formData: FormData) => {
    const response = await updateProfileApi(formData);

    if (!response.success) {
      toast.error(response.message);
      return;
    }
    dispatch(updateProfile(response.data));
    toast.success(response.message);
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
