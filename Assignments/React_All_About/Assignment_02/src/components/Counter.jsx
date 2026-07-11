import { useState } from "react"; // Import React Hook for state management
import "./Counter.css"; // Import CSS file for styling the counter

function Counter() { // Create a functional React component named Counter

  const [count, setCount] = useState(0); 
  // useState creates a state variable
  // count → current value
  // setCount → function used to update the value
  // 0 → initial value of the counter

  if (count < 0) { 
    // Check if the counter becomes negative

    alert("Count cannot be negative!"); 
    // Show alert message to the user

    setCount(0); 
    // Reset the counter back to 0
  }

  return (
    <div className="counter-container">
      {/* Main container for the counter */}

      <button 
      className="btn increase"
      onClick={() => setCount(count + 1)}>
      {/* When button is clicked, increase count by 1 */}
        Increase
      </button>

      <h1 className="count">{count}</h1>
      {/* Display the current counter value */}

      <button 
      className="btn decrease"
      onClick={() => setCount(count - 1)}>
      {/* When button is clicked, decrease count by 1 */}
        Decrease
      </button>

    </div>
  );
}

export default Counter; 
// Export this component so it can be used in other files like App.js