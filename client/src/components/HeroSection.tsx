import { useEffect, useState } from "react";
import { featuredBooksApi } from "../apis/book";
import { FeaturedBook } from "../types";
import Slider from "react-slick";
import LoadingSpinner from "./common/LoadingSpinner";
import { Button, Skeleton } from "@nextui-org/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Skeletons from "./skeletons";

const HeroSection = () => {
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([]);
  const [busy, setBusy] = useState(true);

  const fetchFeaturedBooks = async () => {
    const response = await featuredBooksApi();

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
    <div className="md:h-96 overflow-hidden rounded-md p-5 bg-[#faf7f2] dark:bg-[#231e1a] ">
      <Slider {...settings}>
        {featuredBooks.map((book) => {
          return (
            <div key={book.slug}>
              <div className="md:flex justify-between ">
                <div className="flex-1 flex flex-col justify-center p-5">
                  <h1 className="lg:text-5xl text-3xl">{book.slogan}</h1>
                  <p className="mt-3 md:text-lg italic"> {book.title}</p>
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

                <div className="p-5 flex-1 flex items-center justify-center">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="md:w-48 md:h-80 w-32  rounded-md object-cover shadow-lg rotate-12"
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
