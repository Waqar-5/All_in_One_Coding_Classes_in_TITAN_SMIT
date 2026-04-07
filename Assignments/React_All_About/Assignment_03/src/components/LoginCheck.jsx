import React, { useState } from "react";

function LoginCheck() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      <h2>Login Check</h2>

      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>

      <button onClick={() => setIsAdmin(!isAdmin)}>
        Toggle Admin
      </button>

      <h3>
        {isLoggedIn && isAdmin
          ? "Welcome Admin Dashboard"
          : "Access Denied"}
      </h3>
    </div>
  );
}

export default LoginCheck;