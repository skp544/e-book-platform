import HeroSection from "../components/home/HeroSection.tsx";
import BookByGenre from "../components/home/BookByGenre.tsx";

const Homepage = () => {
  return (
    <div className="space-y-10 px-5 lg:p-0">
      <HeroSection />
      <BookByGenre genre="Fiction" />
      <BookByGenre genre="Mystery" />
      <BookByGenre genre="Science Fiction" />
      <BookByGenre genre="Horror" />
      <BookByGenre genre="Fantasy" />
    </div>
  );
};
export default Homepage;
