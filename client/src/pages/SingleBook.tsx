import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { booksByPublicDetailApi } from "../apis/book";
import { IBookPublicDetails, Review } from "../types";
import toast from "react-hot-toast";
import BookDetail from "../components/book/BookDetail";
import Skeletons from "../components/skeletons";
import ReviewSection from "../components/book/ReviewSection.tsx";
import { getPublicReviewApi } from "../apis/review.ts";
import RecommendedSection from "../components/book/RecommendedSection.tsx";

const fetchBookReviews = async (id: string) => {
  const response = await getPublicReviewApi(id);

  return response.data;
};

const SingleBook = () => {
  const { slug } = useParams();
  const [bookDetails, setBookDetails] = useState<IBookPublicDetails>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [busy, setBusy] = useState(true);

  const fetchBookDetails = async () => {
    const response = await booksByPublicDetailApi(slug!);
    setBusy(false);
    if (!response.success) {
      return toast.error(response.message);
    }
    const reviewData = await fetchBookReviews(response?.data.id);
    setBookDetails(response?.data);
    setReviews(reviewData);
  };

  useEffect(() => {
    fetchBookDetails();
  }, [slug]);

  if (busy) {
    return <Skeletons.BookDetails />;
  }

  return (
    <div className="p-5 lg:p-0 space-y-20 ">
      <BookDetail book={bookDetails} />

      {/* Recommemded Section */}

      <RecommendedSection id={bookDetails?.id} />

      {/*  Review Section */}
      <ReviewSection
        id={bookDetails?.id}
        title={`${bookDetails?.title} Reviews`}
        reviews={reviews}
      />
    </div>
  );
};

export default SingleBook;
