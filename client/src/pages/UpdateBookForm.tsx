import BookForm from "../components/book/BookForm.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookDetailsApi, updateBookApi } from "../apis/book.ts";
import { InitialBookToUpdate } from "../types";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";

const UpdateBookForm = () => {
  const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
  const [busy, setBusy] = useState(true);

  const { slug } = useParams();

  const handleSubmit = async (formData: FormData) => {
    const response = await updateBookApi(formData);

    if (!response.success) {
      toast.error(response.message);
    }

    if (response.success) {
      toast.success(response.message, { duration: 5000 });
    }
  };

  const fetchBookDetails = async () => {
    const response = await bookDetailsApi(slug as string);

    if (!response.success) {
      setBusy(false);
      return toast.error(response.message);
    }
    if (response.success) {
      setBookInfo(response.data);
    }

    setBusy(false);
  };

  useEffect(() => {
    fetchBookDetails();
  }, []);

  if (busy) return <LoadingSpinner verify={false} />;

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
