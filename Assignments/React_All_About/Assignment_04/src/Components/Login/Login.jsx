import { useState } from "react";
import "./Login.css";

function Login() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="login-container">

      <h2 className="login-title">User Authentication</h2>

      {isLoggedIn ? (
        <div className="welcome-box">
          <h3>Welcome User 👋</h3>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      ) : (
        <div className="login-box">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button onClick={() => setIsLoggedIn(true)}>Login</button>
        </div>
      )}

    </div>
  );
}

export default Login;