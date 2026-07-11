import { useState } from "react";
import "./ChangeText.css";

function ChangeText() {

  const [text, setText] = useState("Click the button");

  const handleClick = () => {
    setText("Button Clicked Successfully!");
  };

  return (
    <div className="change-container">

      <h2 className="change-title">Click Event Example</h2>

      <p className="change-text">{text}</p>

      <button className="change-btn" onClick={handleClick}>
        Click Me
      </button>

    </div>
  );
}

export default ChangeText;