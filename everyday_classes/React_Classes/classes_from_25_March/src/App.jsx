
import "./App.css"; 
import Both from "./Components/hooks/Both";
import My_useState from "./Components/hooks/My_useState";
import CounterToggle from "./Components/Tasks_17_April/CounterToggle";
import Parent from "./Components/Tasks_17_April/Parent";
import ProductCard from "./Components/Tasks_17_April/ProductCard";
import UseEffectTask from "./Components/Tasks_17_April/UseEffectTask";
import UseRefTask from "./Components/Tasks_17_April/UseRefTask";
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

{/* Date 17-04-2025 */}
<CounterToggle />
<Parent/>
<ProductCard />
<UseEffectTask />
<UseRefTask />
</div>
  </>
  )
}
export default App;