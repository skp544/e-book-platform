import { Link } from "react-router-dom";
import { IBookPublicDetails } from "../../types";
import { calculateDiscount, formatPrice } from "../../helper";
import { Button, Chip, Divider } from "@nextui-org/react";
import {
  FaEarthAfrica,
  FaMasksTheater,
  FaRegCalendarDays,
  FaRegFileLines,
  FaStar,
} from "react-icons/fa6";
import { TbShoppingCartPlus } from "react-icons/tb";
import RichEditor from "../rich-editor";
import useCart from "../../hooks/useCart";
import { instantCheckoutApi } from "../../apis/checkout.ts";
import toast from "react-hot-toast";
import { useState } from "react";
import useAuth from "../../hooks/useAuth.ts";

interface Props {
  book?: IBookPublicDetails;
}

const BookDetail = ({ book }: Props) => {
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

  const handleCartUpdate = () => {
    updateCart({ product: book, quantity: 1 });
  };

  const handleBuyNow = async () => {
    setBusy(true);
    const response = await instantCheckoutApi({ productId: id });
    setBusy(false);

    if (!response.success) {
      return toast.error(response.message);
    }

    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl;
    }
  };

  return (
    <div className="md:flex">
      <div className="">
        <img
          src={cover}
          className="w-48 h-80 rounded-md object-cover"
          alt={title}
        />
      </div>

      <div className="pl-0 md:pl-10 flex-1 pt-6">
        <h1 className="sm:text-3xl text-2xl font-semibold">{title}</h1>
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
          <p className="line-through italic">
            {formatPrice(Number(price.mrp))}
          </p>
          <Chip color="danger">{`${calculateDiscount(price)}% Off`}</Chip>
        </div>

        <div className="mt-3 flex items-center space-x-2 font-semibold">
          {rating ? (
            <Chip color="danger">
              <div className="flex space-x-1 items-center">
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
            className="font-normal text-sm hover:underline"
          >
            Add a Review
          </Link>
        </div>

        <div className="mt-6">
          <RichEditor className="regular" value={description} />
        </div>

        <div className="flex items-center space-x-6 mt-6 h-10">
          <div className="flex flex-col items-center justify-center space-y-1">
            <FaEarthAfrica className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">{language}</span>
          </div>

          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaMasksTheater className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">{genre}</span>
          </div>

          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaRegFileLines className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">
              {fileInfo.size}
            </span>
          </div>

          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaRegCalendarDays className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">
              {publishedAt}
            </span>
          </div>
        </div>

        <div className="flex items-center mt-6 space-x-3">
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
