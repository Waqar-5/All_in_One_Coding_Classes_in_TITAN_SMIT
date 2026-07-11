import React, { useState } from "react";

function Result() {
  const [marks, setMarks] = useState("");

  return (
    <div>
      <h2>Result Checker</h2>

      <input
        type="number"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        placeholder="Enter your marks"
      />

      <h3>
        Result:{" "}
        {marks === ""
          ? ""
          : marks >= 50
          ? "Pass"
          : "Fail"}
      </h3>
    </div>
  );
}

export default Result;