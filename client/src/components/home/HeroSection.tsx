import { useEffect, useState } from "react";
import { FeaturedBook } from "../../types";
import { featuredBooksApi } from "../../apis/book.ts";
import { addToast, Button } from "@heroui/react";
import Skeletons from "../skeletons";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const HeroSection = () => {
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([]);
  const [busy, setBusy] = useState(true);

  const fetchFeaturedBooks = async () => {
    const response = await featuredBooksApi();
    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }
    setBusy(false);
    setFeaturedBooks(response.data);
  };

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  if (busy) {
    return <Skeletons.HeroSection />;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="overflow-hidden rounded-md bg-[#faf7f2] p-5 md:h-96 dark:bg-[#231e1a]">
      <Slider {...settings}>
        {featuredBooks.map((book) => {
          return (
            <div key={book.slug}>
              <div className="justify-between md:flex">
                <div className="flex flex-1 flex-col justify-center p-5">
                  <h1 className="text-3xl text-white lg:text-5xl">
                    {book.slogan}
                  </h1>
                  <p className="mt-3 italic text-white md:text-lg">
                    {" "}
                    {book.title}
                  </p>
                  <div className="mt-3">
                    <Button
                      radius="sm"
                      color="danger"
                      variant="bordered"
                      endContent={<FaArrowRightLong />}
                      as={Link}
                      to={`/book/${book.slug}`}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center p-5">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-32 rotate-12 rounded-md object-cover shadow-lg md:h-80 md:w-48"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};
export default HeroSection;
