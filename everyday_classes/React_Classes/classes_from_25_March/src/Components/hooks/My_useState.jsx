import { useState, useEffect } from "react";
import "./style.css";
function My_useState() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 0) {
      alert("Count cannot be negative " + count);
      setCount(0); // optional: auto fix it back to 0
    }

    console.log("Count is " + count);
  }, [count]);

  return (
    <>
      <h1>Counter {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </>
  );
}

export default My_useState;