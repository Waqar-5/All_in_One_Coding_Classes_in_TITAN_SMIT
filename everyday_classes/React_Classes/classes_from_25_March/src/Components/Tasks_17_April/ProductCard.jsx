function ProductCard(props) {  
return ( <div  
style={{  
 border: "1px solid black",  
padding: "15px", width:  
"250px", borderRadius:  
"10px",  
 }}  
 >  
 <h2>{props.name}</h2>  
 <p>Price: {props.price}</p>  
 <p>Brand: {props.brand}</p>  
 <p>  
 Status:{" "}  
 {props.inStock ? "Available" : "Out of Stock"}   </p>  
 </div>  
 );  
}  
export default ProductCard;  
