import { useState } from "react";
import "./Counter.css";

function Counter() {

  const [count, setCount] = useState(0);

  return (
    <div className="counter">

      <h2 className="counter-title">Counter App</h2>

      <div className="counter-card">

        <h1 className="count-number">{count}</h1>

        <div className="button-group">
          <button className="increment" onClick={() => setCount(count + 1)}>
            Increment
          </button>

          <button className="decrement" onClick={() => setCount(count - 1)}>
            Decrement
          </button>
        </div>

      </div>

    </div>
  );
}

export default Counter;