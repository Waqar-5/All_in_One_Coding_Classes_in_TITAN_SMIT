import { useState } from "react"; 
function CounterToggle() {  
 const [count, setCount] = useState(0);  
 const [showText, setShowText] = useState(false);   return  
(  
 <div>  
 <h2>Counter: {count}</h2>  
 <button onClick={() => setCount(count + 1)}>   Increase  
 </button>  
 <button onClick={() => setCount(count - 1)}>   Decrease  
 </button>  
 <hr />  
 <button onClick={() => setShowText(!showText)}>   Toggle Text  
 </button>  
 {showText && <p>Hello React Students</p>}   </div>  
 );  
}  
export default CounterToggle; 
