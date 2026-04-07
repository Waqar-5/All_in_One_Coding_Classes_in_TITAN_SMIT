import { useState } from "react";


function Counter() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };

  const decrease = () => {
    if (count === 0) {
      alert("Count cannot be negative!");
      return;
    }
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="counter-container">
      <h1>A Simple Counter</h1>
      <button 
        className="btn increase"
        onClick={increase}>
        Increase
      </button>

      <h1 className="count">{count}</h1>

      <button 
        className="btn decrease"
        onClick={decrease}>
        Decrease
      </button>

      <button 
        className="btn reset"
        onClick={reset}>
        Reset
      </button>

    </div>
  );
}

export default Counter;