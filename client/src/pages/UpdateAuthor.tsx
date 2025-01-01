import { useEffect, useState } from "react";
import AuthorForm from "../components/author/AuthorForm";
import useAuth from "../hooks/useAuth";
import {
  getAuthorDetailsApi,
  registerAuthorApi,
  updateAuthorApi,
} from "../apis/author";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { AuthorInfo, AuthorInitialState } from "../types";
import { data } from "react-router-dom";

const UpdateAuthor = () => {
  const { profile } = useAuth();
  const [busy, setBusy] = useState(true);
  const [authorInfo, setAuthorInfo] = useState<AuthorInitialState>();

  const fetchAuthorInfo = async () => {
    const response = await getAuthorDetailsApi(profile?.authorId);

    setBusy(false);

    if (!response.success) {
      return toast.error(response.message);
    }

    setAuthorInfo(response.data);
  };

  useEffect(() => {
    fetchAuthorInfo();
  }, []);

  const handleSubmit = async (data: AuthorInfo) => {
    const response = await updateAuthorApi(data);

    if (!response.success) {
      toast.error(response.message);
    }

    if (response.success) {
      toast.success(response.message, { duration: 3000 });
    }
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
