import { useParams } from "react-router-dom";
import { FormEventHandler, useEffect, useState } from "react";
import { addToast, Button } from "@heroui/react";
import { addReviewApi, getReviewApi } from "../apis/review.ts";
import { FaRegStar, FaStar } from "react-icons/fa";
import RichEditor from "../components/rich-editor";

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
      return addToast({
        color: "danger",
        title: "Error",
        description: "Please select a rating",
      });
    }

    setLoading(true);

    const response = await addReviewApi({
      bookId,
      rating: selectedRatings.length,
      content,
    });

    setLoading(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }
    addToast({
      color: "success",
      title: "Added",
      description: response.message,
    });
  };

  const fetchAllReviews = async () => {
    if (!bookId) return;

    const response = await getReviewApi(bookId);
    setFetching(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
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
      <div className="p-5 text-center">
        <p>Please wait...</p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className={"space-y-6 p-5"}>
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
