import DyamicCss from "./examples/DyanmicCss";
import Greet from "./examples/Greet";
import Profile from "./examples/Profile";
import TLCss from "./examples/TLCss";
import Greeting from "./Greeting";
import Products from "./Product";
import UserList from "./UserList";

function All(){
    return(
        <>
        <Greeting name="Ali"  city="Sukkur"/>
<Products name="Laptop" price={85000} discount={5000} />
<UserList />
<br />
        <Greet />
        <DyamicCss ></DyamicCss>
        <br />
        <TLCss></TLCss>
        <br />
        <br />
        <Profile ></Profile>
        </>
    )
}
export default All;