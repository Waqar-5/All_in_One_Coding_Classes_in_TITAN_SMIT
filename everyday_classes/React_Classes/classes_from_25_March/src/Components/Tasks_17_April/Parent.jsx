import ProductCard from "./ProductCard";  
function Parent() {  
return (  
 <div>  
 <ProductCard  
name="Laptop"  
price={75000} brand="HP"  
inStock={true}  
 />  
 </div>  
 );  
}  
export default Parent; 
