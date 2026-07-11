import AccessCheck from "./components/AccessChecker"
import Counter from "./components/Counter"
import EvenOdd from "./components/EvenOdd"
import Header from "./components/Header"
import LoginCheck from "./components/LoginCheck"
import MarksInput from "./components/MarksInput"
import Result from "./components/Result"
import Student from "./components/Student"
import VoteCheck from "./components/VoteCheck"
import Welcome from "./components/Welcome"

function App(){
  return (
    <>
    {/* Task 1 */}
    <Header/>
    <br />
    {/* Task 2 */}
    <Welcome />
    <br />
    {/* Task 3 */}
    <div>
      <Student name="Ali" age={20} className="BSCS" />
      <Student name="Sara" age={22} className="BBA" />
    </div>
    <br />
    {/* Task 4 */}
    <MarksInput />
    <br />
    {/* Task 5 */}
    <EvenOdd />
    <br />
    {/* Task 6 */}
    <VoteCheck />
    <br />
    {/* Task 7 */}
    <LoginCheck />
    <br />
    {/* Task 8 */}
    <AccessCheck />
    <br />
    {/* Task 9 */}
    <Result />
    <br />

    {/* Task  10*/}
    <Counter />

    </>
  )
}
export default App