import { useState } from "react";
import { LanguageContext } from "./context/LanguageContext";

import Parent from "./Components/Parent";
import CounterToggle from "./Components/CounterToggle";
import UseRefTask from "./Components/UseRefTask";
import UseEffectTask from "./Components/UseEffectTask"; // Correct PascalCase
import Home from "./Components/Home";

function App() {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "sd" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>🔥 React Practice Project</h1>
        
        <button onClick={toggleLanguage} style={{ marginBottom: "20px", cursor: "pointer", padding: "10px 20px", fontSize: "16px", borderRadius: "5px", backgroundColor: "#007BFF", color: "#fff", border: "none" }}>
          Switch Language 🌍 ({language === "en" ? "English" : "Sindhi"})
        </button>

        <Home />
        <hr />
        <Parent />
        <hr />
        <CounterToggle />
        <hr />
        {/* Fixed: UseEffectTask must be Capitalized */}
        <UseEffectTask /> 
        <hr />
        <UseRefTask />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;