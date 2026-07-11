import { useContext } from "react";
import { LanguageContext } from "../Context/LanguageContext";

function Home() {
  const { language } = useContext(LanguageContext);

  return (
    <h2>
      {language === "en"
        ? "Hello User"
        : "How are you, dear! 😊"}
    </h2>
  );
}

export default Home;