import { useState } from "react";

function DynamicCss() {

const [isActive, setIsActive] = useState(false);

return (
<div>

<button
className={`btn ${isActive ? "active" : "inactive"}`}
onClick={() => setIsActive(!isActive)}
>
{isActive ? "Deactivate" : "Activate"}
</button>

</div>
);

}

export default DynamicCss;
// This is very common in real React projects.