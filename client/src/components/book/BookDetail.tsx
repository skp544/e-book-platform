import { IBookPublicDetails } from "../../types";
import { FC, useState } from "react";
import useAuth from "../../hooks/useAuth.ts";
import { Link } from "react-router-dom";
import { calculateDiscount, formatPrice } from "../../helpers";
import { addToast, Button, Chip, Divider } from "@heroui/react";
import { FaStar } from "react-icons/fa";
import RichEditor from "../rich-editor";
import {
  FaEarthAfrica,
  FaMasksTheater,
  FaRegCalendarDays,
  FaRegFileLines,
} from "react-icons/fa6";
import { TbShoppingCartPlus } from "react-icons/tb";
import useCart from "../../hooks/useCart.ts";
import { instantCheckoutApi } from "../../apis/checkout.ts";

interface Props {
  book?: IBookPublicDetails;
}

const BookDetail: FC<Props> = ({ book }) => {
  const { updateCart, pending } = useCart();
  const { profile } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!book) {
    return null;
  }

  const {
    id,
    cover,
    description,
    title,
    author,
    rating,
    publicationName,
    price,
    language,
    fileInfo,
    genre,
    publishedAt,
    slug,
  } = book;

  const alreadyPurchased = profile?.books?.includes(id) || false;

  const handleBuyNow = async () => {
    setBusy(true);
    const response = await instantCheckoutApi({ productId: id });
    setBusy(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl;
    }
  };

  const handleCartUpdate = () => {
    updateCart({ product: book, quantity: 1 });
  };

  return (
    <div className={"md:flex"}>
      <div className="">
        <img
          src={cover}
          className="h-80 w-48 rounded-md object-cover"
          alt={title}
        />
      </div>
      <div className="flex-1 pl-0 pt-6 md:pl-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <div>
          <Link
            className="font-semibold hover:underline"
            to={`/author/${author.id}`}
          >
            {author.name}
          </Link>

          <p>{publicationName}</p>
        </div>

        <div className="mt-3 flex items-center space-x-2">
          <p className="font-semibold">{formatPrice(Number(price.sale))}</p>
          <p className="italic line-through">
            {formatPrice(Number(price.mrp))}
          </p>
          <Chip color="danger">{`${calculateDiscount(price)}% Off`}</Chip>
        </div>

        <div className="mt-3 flex items-center space-x-2 font-semibold">
          {rating ? (
            <Chip color="danger">
              <div className="flex items-center space-x-1">
                <span>{rating}</span>
                <FaStar />
              </div>
            </Chip>
          ) : (
            <Chip>
              <span className="text-xs">No Ratings</span>
            </Chip>
          )}

          <Link
            to={`/rate/${id}`}
            className="text-sm font-normal hover:underline"
          >
            Add a Review
          </Link>
        </div>

        <div className="mt-6">
          <RichEditor className="regular" value={description} />
        </div>

        <div className="mt-6 flex h-10 items-center space-x-6">
          <div className="flex flex-col items-center justify-center space-y-1">
            <FaEarthAfrica className="text-xl sm:text-2xl" />
            <span className="truncate text-[10px] sm:text-xs">{language}</span>
          </div>

          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaMasksTheater className="text-xl sm:text-2xl" />
            <span className="truncate text-[10px] sm:text-xs">{genre}</span>
          </div>

          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaRegFileLines className="text-xl sm:text-2xl" />
            <span className="truncate text-[10px] sm:text-xs">
              {fileInfo.size}
            </span>
          </div>

          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaRegCalendarDays className="text-xl sm:text-2xl" />
            <span className="truncate text-[10px] sm:text-xs">
              {publishedAt}
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-center space-x-3">
          {alreadyPurchased ? (
            <Button
              radius="sm"
              as={Link}
              to={`/read/${slug}?title=${title}&id=${id}`}
            >
              Read Now
            </Button>
          ) : (
            <>
              <Button
                variant="light"
                type="button"
                isLoading={pending || busy}
                onPress={handleCartUpdate}
                startContent={<TbShoppingCartPlus />}
              >
                Add to Cart
              </Button>
              <Button
                onPress={handleBuyNow}
                isLoading={pending || busy}
                type="button"
                variant="flat"
              >
                Buy now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookDetail;
