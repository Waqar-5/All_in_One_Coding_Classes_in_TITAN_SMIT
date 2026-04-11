import "./Employees.css";

function Employees(){

const employees = [];

return(

<div className="employees-container">

<h2 className="employees-title">Employees</h2>

{employees.length === 0 ? (
<p className="empty-message">No Employees Found</p>
) : (

employees.map((emp,index)=>(
<div className="employee-card" key={index}>
{emp}
</div>
))

)}

</div>

)

}

export default Employees;