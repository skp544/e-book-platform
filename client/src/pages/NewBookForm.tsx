import BookForm from "../components/book/BookForm.tsx";
import {createNewBookApi} from "../apis/book.ts";
import toast from "react-hot-toast";

const NewBookForm = () => {
  const handleSubmit = async (formData: FormData) => {
    const response = await createNewBookApi(formData);
    
    if (!response.success) {
     toast.error(response.message);
    }
    
    if (response.success) {
      toast.success(response.message, {duration: 5000});
    }
    
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
