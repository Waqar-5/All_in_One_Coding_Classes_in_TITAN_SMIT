
import "./App.css"; 
import Both from "./Components/hooks/Both";
import My_useState from "./Components/hooks/My_useState";
import All from "./Components/TemplateLiterals/All";

function App(){
  return(
<>
<div className="body">
  
  {/* Date 14-04-2025 */}
  <All />
  {/* Date 16-04-2025 */}
  <My_useState />
  <Both />

</div>
  </>
  )
}
export default App;