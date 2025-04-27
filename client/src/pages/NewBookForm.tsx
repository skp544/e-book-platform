import BookForm from "../components/book/BookForm.tsx";
import { createNewBookApi } from "../apis/book.ts";
import { addToast } from "@heroui/react";

const NewBookForm = () => {
  const handleSubmit = async (formData: FormData) => {
    const response = await createNewBookApi(formData);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    addToast({
      color: "success",
      title: "Created",
      description: response.message,
    });
  };

  return (
    <div>
      <BookForm
        onSubmit={handleSubmit}
        title={"Publish New Book"}
        submitBtnTitle={"Publish Book"}
      />
    </div>
  );
};
export default NewBookForm;
