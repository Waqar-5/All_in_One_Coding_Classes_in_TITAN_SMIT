import React, { useState } from "react";

function MarksInput() {
  const [marks, setMarks] = useState("");

  const handleChange = (e) => {
    setMarks(e.target.value);
  };

  return (
    <div>
      <h2>Enter Marks</h2>

      <input
        type="number"
        value={marks}
        onChange={handleChange}
        placeholder="Enter your marks"
      />

      <h3>Your Marks: {marks}</h3>
    </div>
  );
}

export default MarksInput;