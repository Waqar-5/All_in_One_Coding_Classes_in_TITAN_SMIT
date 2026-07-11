import "./Fruits.css"

function Fruits(){

const fruits = ["Apple","Banana","Mango","Orange"]

return(

<div className="fruits-section">

<h2 className="fruits-title">Fruits</h2>

<div className="fruit-container">

{fruits.map((fruit,index)=>(
<div className="fruit-card" key={index}>
<h3>{fruit}</h3>
</div>
))}

</div>

</div>

)

}

export default Fruits