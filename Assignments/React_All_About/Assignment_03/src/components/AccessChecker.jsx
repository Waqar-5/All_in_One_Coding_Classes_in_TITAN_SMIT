import React, { useState } from "react";

function AccessCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  return (
    <div>
      <h2>Access Check</h2>

      <button onClick={() => setIsAdmin(!isAdmin)}>
        Toggle Admin
      </button>

      <button onClick={() => setIsModerator(!isModerator)}>
        Toggle Moderator
      </button>

      <h3>
        {isAdmin || isModerator
          ? "Access Granted"
          : "Access Denied"}
      </h3>
    </div>
  );
}

export default AccessCheck;