import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import SignUp from "./pages/SignUp.tsx";


const App = () => {
  return (
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/sign-up"} element={<SignUp />} />
      </Routes>
  );
};

export default App;
