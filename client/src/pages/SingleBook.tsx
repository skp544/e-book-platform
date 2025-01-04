import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { booksByPublicDetailApi } from "../apis/book";
import { IBookPublicDetails } from "../types";
import toast from "react-hot-toast";
import BookDetail from "../components/book/BookDetail";
import Skeletons from "../components/skeletons";

const SingleBook = () => {
  const { slug } = useParams();
  const [bookDetails, setBookDetails] = useState<IBookPublicDetails>();
  const [busy, setBusy] = useState(true);

  const fetchBookDetails = async () => {
    const response = await booksByPublicDetailApi(slug!);
    setBusy(false);
    if (!response.success) {
      return toast.error(response.message);
    }
    setBookDetails(response?.data);
  };

  useEffect(() => {
    fetchBookDetails();
  }, [slug]);

  if (busy) {
    return <Skeletons.BookDetails />;
  }

  return (
    <div className="p-5 lg:p-0">
      <BookDetail book={bookDetails} />
    </div>
  );
};

export default SingleBook;
