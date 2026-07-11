import { useState } from "react";
import "./CounterToggle.css";

function CounterToggle() {
  const [count, setCount] = useState(0);
  const [showText, setShowText] = useState(false);

  return (
    <div className="container">
      
      <h2 className="title">Counter: {count}</h2>

      {/* Buttons */}
      <div className="btn-group">
        <button
          className="btn increase"
          onClick={() => setCount(count + 1)}
        >
          Increase
        </button>

        <button
          className="btn decrease"
          onClick={() => setCount(count - 1)}
        >
          Decrease
        </button>
      </div>

      <hr />

      {/* Toggle */}
      <button
        className="btn toggle"
        onClick={() => setShowText(!showText)}
      >
        Toggle Text
      </button>

      {/* Conditional */}
      {showText && (
        <p className="text">Hello React Students 🚀</p>
      )}
    </div>
  );
}

export default CounterToggle;