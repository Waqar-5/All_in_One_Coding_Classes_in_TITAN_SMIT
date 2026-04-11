import { useState } from "react";
import "./LiveInput.css";

function LiveInput(){

  const [message,setMessage] = useState("");

  return(

  <div className="input-container">

  <h2 className="input-title">Live Text Display</h2>

  <input
  className="input-box"
  type="text"
  placeholder="Type something..."
  onChange={(e)=>setMessage(e.target.value)}
  />

  <p className="display-text">
  You typed: {message}
  </p>

  </div>

  )

}

export default LiveInput;