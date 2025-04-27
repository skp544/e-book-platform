import { FC, useEffect, useState } from "react";
import { IBookByGenre } from "../../types";
import { booksByGenreApi } from "../../apis/book.ts";
import { addToast } from "@heroui/react";
import Skeletons from "../skeletons";
import BookList from "../book/BookList.tsx";

interface Props {
  genre: string;
}

const BookByGenre: FC<Props> = ({ genre }) => {
  const [books, setBooks] = useState<IBookByGenre[]>([]);
  const [busy, setBusy] = useState(true);

  const fetchBooksByGenre = async () => {
    const response = await booksByGenreApi(genre);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
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
