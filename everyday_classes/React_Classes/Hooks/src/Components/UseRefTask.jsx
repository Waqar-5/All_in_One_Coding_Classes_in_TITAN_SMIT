import { useRef, useState, useEffect } from "react";
import "./UseRefTask.css";

function UseRefTask() {
  const [value, setValue] = useState("");
  const prevValue = useRef("");

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <div className="container">

      <h2>🔁 Previous Value Tracker</h2>

      <input
        className="input"
        type="text"
        placeholder="Type something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="fade">
        <p className="label">
          Current Value: <span className="value">{value || "—"}</span>
        </p>

        <p className="label">
          Previous Value:{" "}
          <span className="prev">{prevValue.current || "—"}</span>
        </p>
      </div>

    </div>
  );
}

export default UseRefTask;