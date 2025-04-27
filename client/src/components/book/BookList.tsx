import { IBookByGenre } from "../../types";
import { FC } from "react";
import DividerWithTitle from "../common/DividerWithTitle.tsx";
import { Chip } from "@heroui/react";
import { FaStar } from "react-icons/fa";
import { calculateDiscount, formatPrice } from "../../helpers";
import { Link } from "react-router-dom";

interface Props {
  data: IBookByGenre[];
  title?: string;
}

const BookList: FC<Props> = ({ data, title }) => {
  return (
    <div>
      <DividerWithTitle title={title} />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {data.map((book) => {
          return (
            <Link key={book.id} to={`/book/${book.slug}`}>
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-[185px] w-32 rounded object-contain"
                />

                <div className="w-full space-y-2">
                  <p className="line-clamp-2 font-bold">{book.title}</p>

                  <Chip color="danger" radius="sm" size="sm">
                    {calculateDiscount(book.price)}% Off
                  </Chip>
                </div>

                <div className="w-full">
                  <div className="flex space-x-2">
                    <p className="font-bold">
                      {formatPrice(Number(book.price.sale))}
                    </p>
                    <p className="line-through">
                      {formatPrice(Number(book.price.mrp))}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  {book.rating ? (
                    <Chip radius="sm" color="warning" variant="solid">
                      <div className="flex items-center space-x-1 text-sm font-semibold">
                        <span>{book.rating}</span> <FaStar />
                      </div>
                    </Chip>
                  ) : (
                    <span>No Ratings</span>
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
export default BookList;
