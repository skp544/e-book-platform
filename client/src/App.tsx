import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import SignUp from "./pages/SignUp.tsx";
import Container from "./components/common/Container.tsx";
import Verify from "./pages/Verify.tsx";
import NewUser from "./pages/NewUser.tsx";


const App = () => {
  return (
      <Container>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/sign-up"} element={<SignUp />} />
        <Route path={"/verify"} element={<Verify />} />
        <Route path={"/new-user"} element={<NewUser />} />
      </Routes>
      </Container>
  );
};

export default App;
