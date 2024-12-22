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

const App = () => {
  return (
    <Container>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/verify"} element={<Verify />} />

        <Route element={<Private />}>
          <Route path={"/new-user"} element={<NewUser />} />
          <Route path={"/update-profile"} element={<UpdateProfile />} />
          <Route path={"/profile"} element={<Profile />} />
        </Route>

        <Route element={<Guest />}>
          <Route path={"/sign-up"} element={<SignUp />} />
        </Route>
      </Routes>
    </Container>
  );
};

export default App;
