import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import SignUp from "./pages/SignUp.tsx";
import Container from "./components/common/Container.tsx";


const App = () => {
  return (
      <Container>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/sign-up"} element={<SignUp />} />
      </Routes>
      </Container>
  );
};

export default App;
