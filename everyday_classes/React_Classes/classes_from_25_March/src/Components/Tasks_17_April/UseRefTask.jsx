import { useState, useEffect, useRef } from "react";  
function UseRefTask() {  
 const [value, setValue] = useState("");  
const prevValue = useRef("");  
 useEffect(() => {  
 prevValue.current = value;  
 }, [value]);  
 return ( <div>  
<input  
type="text"  
value={value}  
 onChange={(e) => setValue(e.target.value)}   />  
 <h3>Current Value: {value}</h3>  
 <h3>Previous Value: {prevValue.current}</h3>   </div>  
 );  
}  
export default UseRefTask;
