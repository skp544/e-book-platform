import { useEffect, useState } from "react";
import { booksByGenreApi } from "../apis/book";
import { IBookByGenre } from "../types";
import { Chip } from "@nextui-org/react";
import DividerWithTitle from "./common/DividerWithTitle";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { calculateDiscount, formatPrice } from "../helper";
import Skeletons from "./skeletons";
import toast from "react-hot-toast";

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

  return (
    <div>
      <DividerWithTitle title={genre} />

      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-6">
        {books.map((book) => {
          return (
            <Link to={`/book/${book.slug}`} key={book.id}>
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-32 h-[185px] object-contain rounded-md"
                />

                <div className="w-full space-y-2">
                  <p className="font-semibold line-clamp-2">{book.title}</p>
                  <Chip color="danger" radius="sm" size="sm">
                    {calculateDiscount(book.price)}%
                  </Chip>
                </div>

                <div className="w-full">
                  <div className="flex space-x-2 ">
                    <p className="font-bold">{formatPrice(book.price.sale)}</p>
                    <p className="line-through">
                      {formatPrice(book.price.mrp)}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  {book.rating ? (
                    <Chip radius="sm" color="warning" variant="solid">
                      <div className="flex items-center font-semibold text-sm space-x-1">
                        <span>{book.rating}</span> <FaStar />
                      </div>
                    </Chip>
                  ) : (
                    <span>No Ratings </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookByGenre;
