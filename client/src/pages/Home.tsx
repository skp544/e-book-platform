
import useAuth from "../hooks/useAuth.ts";

const Home = () => {
  const authStatus = useAuth()


  return <div>Home</div>;
};

export default Home;
