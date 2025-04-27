import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IBookPublicDetails, Review } from "../types";
import { booksByPublicDetailApi } from "../apis/book.ts";
import { addToast } from "@heroui/react";
import { getPublicReviewApi } from "../apis/review.ts";
import Skeletons from "../components/skeletons";
import BookDetail from "../components/book/BookDetail.tsx";
import RecommendedSection from "../components/book/RecommendedSection.tsx";
import ReviewSection from "../components/review/ReviewSection.tsx";

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
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
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
    <div className="space-y-20 p-5 lg:p-0">
      <BookDetail book={bookDetails} />

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
