import { useEffect, useState } from "react";
import { booksByGenreApi } from "../../apis/book.ts";
import { IBookByGenre } from "../../types";
import Skeletons from "../skeletons";
import toast from "react-hot-toast";
import BookList from "./BookList.tsx";

interface Props {
  genre: string;
}

const BookByGenre = ({ genre }: Props) => {
  const [books, setBooks] = useState<IBookByGenre[]>([]);
  const [busy, setBusy] = useState(true);

  const fetchBooksByGenre = async () => {
    const response = await booksByGenreApi(genre);

    if (!response.success) {
      return toast.error(response.message);
    }

    setBusy(false);
    setBooks(response.data);
  };

  useEffect(() => {
    fetchBooksByGenre();
  }, [genre]);

  if (busy) {
    return <Skeletons.BookList />;
  }

  return <BookList title={genre} data={books} />;
};

export default BookByGenre;
