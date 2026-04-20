 import { useState, useEffect } from "react";  
function UseEffectTask() {  
 const [message, setMessage] = useState("Loading data...");  
 useEffect(() => {  
 document.title = "React App Loaded";  
 const timer = setTimeout(() => {  
 setMessage("Data Loaded Successfully");   }, 3000);  
 return () =>  
clearTimeout(timer);  
 }, []);  
 return  
(  
 <div>  
 <h2>{message}</h2>  
 </div>  
 ); 
}  
export default UseEffectTask;  
