import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.ts";
import { AuthorInfo, AuthorInitialState } from "../types";
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";
import { getAuthorDetailsApi, updateAuthorApi } from "../apis/author.ts";
import { addToast } from "@heroui/react";
import AuthorForm from "../components/author/AuthorForm.tsx";

const UpdateAuthor = () => {
  const { profile } = useAuth();
  const [busy, setBusy] = useState(true);
  const [authorInfo, setAuthorInfo] = useState<AuthorInitialState>();

  const fetchAuthorDetails = async () => {
    const response = await getAuthorDetailsApi(profile?.authorId);

    setBusy(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    setAuthorInfo(response.data);
  };

  useEffect(() => {
    fetchAuthorDetails();
  }, []);

  const handleSubmit = async (formData: AuthorInfo) => {
    const response = await updateAuthorApi(formData);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    addToast({
      color: "success",
      title: "Success",
      description: response.message,
    });
  };

  if (busy) {
    return <LoadingSpinner verify={false} />;
  }

  return (
    <AuthorForm
      initialState={authorInfo}
      onSubmit={handleSubmit}
      btnTitle="Update Bio"
    />
  );
};
export default UpdateAuthor;
