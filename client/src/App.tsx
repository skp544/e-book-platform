import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.tsx";
import SignUp from "./pages/SignUp.tsx";
import Container from "./components/common/Container.tsx";
import Verify from "./pages/Verify.tsx";
import NewUser from "./pages/NewUser.tsx";
import Profile from "./pages/Profile.tsx";
import UpdateProfile from "./pages/UpdateProfile.tsx";
import Guest from "./components/routes/Guest.tsx";
import NotFound from "./pages/NotFound.tsx";
import Private from "./components/routes/Private.tsx";
import NewBookForm from "./pages/NewBookForm.tsx";
import Author from "./components/routes/Author.tsx";
import UpdateBookForm from "./pages/UpdateBookForm.tsx";
import NewAuthorRegistration from "./pages/NewAuthorRegistration.tsx";
import UpdateAuthor from "./pages/UpdateAuthor.tsx";
import SingleBook from "./pages/SingleBook.tsx";
import Cart from "./pages/Cart.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import Orders from "./pages/Orders.tsx";
import Library from "./pages/Library.tsx";
import ReviewForm from "./pages/ReviewForm.tsx";
import ReadingPage from "./pages/ReadingPage.tsx";
import AuthorPage from "./pages/AuthorPage.tsx";

const App = () => {
  return (
    <Container>
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/verify"} element={<Verify />} />
        <Route path={"/book/:slug"} element={<SingleBook />} />
        <Route path={"/author/:id"} element={<AuthorPage />} />

        <Route element={<Private />}>
          <Route path={"/new-user"} element={<NewUser />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/update-profile"} element={<UpdateProfile />} />
          <Route
            path={"/author-registration"}
            element={<NewAuthorRegistration />}
          />
          <Route path={"/update-author"} element={<UpdateAuthor />} />
          <Route path={"/cart"} element={<Cart />} />
          <Route path={"/payment-success"} element={<PaymentSuccess />} />
          <Route path={"/orders"} element={<Orders />} />
          <Route path={"/library"} element={<Library />} />
          <Route path={"/rate/:bookId"} element={<ReviewForm />} />
          <Route path={"/read/:slug"} element={<ReadingPage />} />
        </Route>

        <Route element={<Author />}>
          <Route path={"/create-new-book"} element={<NewBookForm />} />
          <Route path={"/update-book/:slug"} element={<UpdateBookForm />} />
        </Route>

        <Route element={<Guest />}>
          <Route path={"/sign-up"} element={<SignUp />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
};
export default App;
