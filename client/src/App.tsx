import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import SignUp from "./pages/SignUp.tsx";
import Container from "./components/common/Container.tsx";
import Verify from "./pages/Verify.tsx";
import NewUser from "./pages/NewUser.tsx";
import Profile from "./pages/Profile.tsx";
import UpdateProfile from "./pages/UpdateProfile.tsx";
import Guest from "./components/routes/Guest.tsx";
import Private from "./components/routes/Private.tsx";
import NewBookForm from "./pages/NewBookForm.tsx";
import UpdateBookForm from "./pages/UpdateBookForm.tsx";
import NewAuthorRegistration from "./pages/NewAuthorRegistration.tsx";
import UpdateAuthor from "./pages/UpdateAuthor.tsx";
import Author from "./components/routes/Author.tsx";
import NotFound from "./pages/NotFound.tsx";
import SingleBook from "./pages/SingleBook.tsx";
import Cart from "./pages/Cart.tsx";

const App = () => {
  return (
    <Container>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/verify"} element={<Verify />} />
        <Route path={"/not-found"} element={<NotFound />} />
        <Route path={"/book/:slug"} element={<SingleBook />} />

        <Route element={<Private />}>
          <Route path={"/new-user"} element={<NewUser />} />
          <Route path={"/cart"} element={<Cart />} />
          <Route path={"/update-profile"} element={<UpdateProfile />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route
            path={"/author-registration"}
            element={<NewAuthorRegistration />}
          />
          <Route path={"/update-author"} element={<UpdateAuthor />} />
          <Route element={<Author />}>
            <Route path={"/create-new-book"} element={<NewBookForm />} />
            <Route path={"/update-book/:slug"} element={<UpdateBookForm />} />
          </Route>
        </Route>

        <Route element={<Guest />}>
          <Route path={"/sign-up"} element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Container>
  );
};

export default App;
