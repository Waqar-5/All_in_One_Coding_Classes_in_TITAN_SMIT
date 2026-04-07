import React, { useState } from "react";

function VoteCheck() {
  const [age, setAge] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setAge(value);

    if (value === "") {
      setResult("");
      return;
    }

    if (value >= 18) {
      setResult("You are Eligible to Vote");
    } else {
      setResult("You are not Eligible to Vote");
    }
  };

  return (
    <div>
      <h2>Vote Checker</h2>

      <input
        type="number"
        value={age}
        onChange={handleChange}
        placeholder="Enter Your Age"
      />

      <h3>Result: {result}</h3>
    </div>
  );
}

export default VoteCheck;