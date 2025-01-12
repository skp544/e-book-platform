import { useEffect, useState } from "react";
import { recommendedBooksApi } from "../../apis/book.ts";
import toast from "react-hot-toast";
import Skeletons from "../skeletons";
import BookList from "./BookList.tsx";
import { IBookByGenre } from "../../types";

interface Props {
  id?: string;
}

const RecommendedSection = ({ id }: Props) => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<IBookByGenre[]>([]);
  const fetchBooks = async () => {
    if (!id) return;
    const response = await recommendedBooksApi(id);
    setFetching(false);

    if (!response.success) {
      return toast.error(response.message);
    }

    setBooks(response.data);
  };

  useEffect(() => {
    if (id) {
      fetchBooks();
    }
  }, [id]);

  if (!id) return;

  if (fetching) {
    return <Skeletons.BookList />;
  }
  return (
    <div>
      <BookList data={books} title="Books related to this book" />
    </div>
  );
};

export default RecommendedSection;
