import { useEffect, useState } from "react";
import { ILibraryBook } from "../types";
import { getAllPurchasedBooksApi } from "../apis/book.ts";
import { addToast, Button } from "@heroui/react";
import { Link } from "react-router-dom";

const Library = () => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<ILibraryBook[]>([]);

  const fetchLibrary = async () => {
    const response = await getAllPurchasedBooksApi();
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
    fetchLibrary();
  }, []);

  if (fetching)
    return (
      <div className="animate-pulse pt-10 text-center">
        <p>Loading...</p>
      </div>
    );

  if (!books.length)
    return (
      <div className="pt-10 text-center text-3xl font-bold opacity-60">
        <p>Oops, your library looks empty!</p>
      </div>
    );

  return (
    <div className="space-y-6 px-5 py-10">
      {books.map((book) => {
        return (
          <div className="flex" key={book.id}>
            <img src={book.cover} alt={book.title} className="w-36 rounded" />

            <div className="space-y-3 p-5">
              <h1 className="line-clamp-1 text-xl font-semibold">
                {book.title}
              </h1>

              <div className="flex items-center space-x-1">
                <span className="font-semibold">By </span>
                <Link
                  className="font-semibold hover:underline"
                  to={`/author/${book.author.id}`}
                >
                  {book.author.name}
                </Link>
              </div>

              <div>
                <Button
                  as={Link}
                  to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                  radius="sm"
                >
                  Read Now
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Library;
