import BookForm from "../components/book/BookForm.tsx";


const NewBookForm = () => {
    return (
        <div>
            <BookForm title={"Publish New Book"} submitBtnTitle={"Publish Book"} />
        </div>
    );
};

export default NewBookForm;