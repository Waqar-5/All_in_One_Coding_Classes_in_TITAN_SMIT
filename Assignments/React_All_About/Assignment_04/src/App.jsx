import ChangeText from "./Components/ChangeText/ChangeText";
import Counter from "./Components/Counter/Counter";
import Employees from "./Components/Employees/Employees";
import Fruits from "./Components/Fruits/Fruits";
import LiveInput from "./Components/LiveInput/LiveInput";
import Login from "./Components/Login/Login";
import Notifications from "./Components/Notifications/Notifications";
import Products from "./Components/Products/Products";
import Students from "./Components/Students/Students";

function App(){
  return (
    <div>
      <h1>My React App</h1>
      <p>Welcome to my React application!</p>
      <Students />
      <br />
      <Products />
      <br />
      <ChangeText />
      <br />
      <LiveInput />
      <br />
      <Notifications />
      <br />
      <Login/>
      <br />
      <Counter />
      <br />
      <Fruits />
      <br />
      <Employees />

    </div>
  );
}

export default App;
