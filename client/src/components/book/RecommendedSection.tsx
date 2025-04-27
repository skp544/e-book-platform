import { FC, useEffect, useState } from "react";
import { IBookByGenre } from "../../types";
import { addToast } from "@heroui/react";
import { recommendedBooksApi } from "../../apis/book.ts";
import Skeletons from "../skeletons";
import BookList from "./BookList.tsx";

interface Props {
  id?: string;
}
const RecommendedSection: FC<Props> = ({ id }) => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<IBookByGenre[]>([]);

  const fetchBooks = async () => {
    if (!id) return;
    const response = await recommendedBooksApi(id);
    setFetching(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
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
