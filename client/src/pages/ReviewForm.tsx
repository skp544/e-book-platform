import { useParams } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FormEventHandler, useEffect, useState } from "react";
import RichEditor from "../components/rich-editor";
import toast from "react-hot-toast";
import { addReviewApi, getReviewApi } from "../apis/review.ts";

const ReviewForm = () => {
  const { bookId } = useParams();
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const ratings = Array(5).fill("");

  const updateRatingChanges = (rating: number) => {
    const newRatings = Array<string>(rating).fill("selected");
    setSelectedRatings(newRatings);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!bookId) return;

    if (!selectedRatings.length) {
      return toast.error("Please select some rating");
    }

    setLoading(true);

    const response = await addReviewApi({
      bookId,
      rating: selectedRatings.length,
      content,
    });

    setLoading(false);

    if (!response.success) {
      return toast.error(response.message);
    }
    toast.success(response.message);
  };

  const fetchAllReviews = async () => {
    if (!bookId) return;
    const response = await getReviewApi(bookId);
    setFetching(false);
    if (!response.success) {
      return toast.error(response.message);
    }

    setContent(response?.data?.content || "");
    updateRatingChanges(response?.data?.rating);
  };

  useEffect(() => {
    if (!bookId) return;
    fetchAllReviews();
  }, [bookId]);

  if (fetching)
    return (
      <div className="text-center p-5">
        <p>Please wait...</p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className={"p-5 space-y-6"}>
      {ratings.map((_, index) => {
        return (
          <Button
            isIconOnly
            color={"warning"}
            key={index}
            variant={"light"}
            radius={"full"}
            onPress={() => updateRatingChanges(index + 1)}
          >
            {selectedRatings[index] === "selected" ? (
              <FaStar size={24} />
            ) : (
              <FaRegStar size={24} />
            )}
          </Button>
        );
      })}

      <RichEditor
        value={content}
        onChange={setContent}
        placeholder="Write about book..."
        editable
      />

      <Button isLoading={loading} type="submit">
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
