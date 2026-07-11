// ✅ TASK 3: useEffect (Loading + Title Change)
import { useEffect, useState } from "react";

function useEffectTask(){
    // Message State
    const [message, setMessage] = useState("Loading data...")

    useEffect(() => {
        // Changebrowser title
        document.title = "React App Loaded"

        // Simulate API delay
        const timer = setTimeout(() =>{
            setMessage("Data Loaded Successfuly")
        }, 3000)

        // Cleanup function to clear timer if component unmounts
        return () => clearTimeout(timer);
    }, [])

    return(
        <div>
            <h2>{message}</h2>
        </div>
    ) 
}

export default useEffectTask;