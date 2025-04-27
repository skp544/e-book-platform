import { useEffect, useState } from "react";
import { InitialBookToUpdate } from "../types";
import { useParams } from "react-router-dom";
import BookForm from "../components/book/BookForm.tsx";
import { bookDetailsApi, updateBookApi } from "../apis/book.ts";
import { addToast } from "@heroui/react";
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";

const UpdateBookForm = () => {
  const { slug } = useParams();
  const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
  const [busy, setBusy] = useState(true);

  const handleSubmit = async (formData: FormData) => {
    const response = await updateBookApi(formData);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    addToast({
      color: "success",
      title: "Updated",
      description: response.message,
    });
  };

  const fetchBookDetails = async () => {
    const response = await bookDetailsApi(slug as string);

    setBusy(false);
    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }
    if (response.success) {
      setBookInfo(response.data);
    }

    setBusy(false);
  };

  useEffect(() => {
    fetchBookDetails();
  }, [slug]);

  if (busy) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <BookForm
        onSubmit={handleSubmit}
        initialState={bookInfo}
        title={"Update Book"}
        submitBtnTitle={"Update Book"}
      />
    </div>
  );
};
export default UpdateBookForm;
