import toast from "react-hot-toast";
import { registerAuthorApi } from "../apis/author.ts";
import AuthorForm from "../components/author/AuthorForm.tsx";
import { AuthorInfo } from "../types/index.ts";

const handleSubmit = async (data: AuthorInfo) => {
  const response = await registerAuthorApi(data);

  if (!response.success) {
    toast.error(response.message);
  }

  if (response.success) {
    toast.success(response.message, { duration: 3000 });
  }
};

const NewAuthorRegistration = () => {
  return <AuthorForm onSubmit={handleSubmit} btnTitle={"Became an author"} />;
};

export default NewAuthorRegistration;
