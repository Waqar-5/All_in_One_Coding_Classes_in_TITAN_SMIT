import React, { useState } from "react";

function EvenOdd() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setNumber(value);

    if (value === "") {
      setResult("");
      return;
    }

    if (value % 2 === 0) {
      setResult("Even");
    } else {
      setResult("Odd");
    }
  };

  return (
    <div>
      <h2>Check Even or Odd</h2>

      <input
        type="number"
        value={number}
        onChange={handleChange}
        placeholder="Enter a number"
      />

      <h3>Result: {result}</h3>
    </div>
  );
}

export default EvenOdd;