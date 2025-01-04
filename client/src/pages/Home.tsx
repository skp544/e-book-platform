import BookByGenre from "../components/BookByGenre";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="space-y-10 px-5 lg:p-0">
      <HeroSection />
      <BookByGenre genre="Fiction" />
    </div>
  );
};

export default Home;
