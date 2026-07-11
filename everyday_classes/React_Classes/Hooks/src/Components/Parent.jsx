import ProductCard from "./ProductCard";
function Parent(){
    return(
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px"}}>

            {/* Passing Props */}
            <ProductCard
            name="Laptop"
            price={120000}
            brand="Dell"
            inStock={true}
            />
            <ProductCard
            name="Smartphone"
            price={50000}
            brand="Samsung"
            inStock={false}
            />
             <ProductCard
            name="Headphones"
            price={3000}
            brand="Sony"
            inStock={true}
            />
                <ProductCard
            name="Smartwatch"
            price={15000}
            brand="Apple"
            inStock={false}
            />
        </div>
    )
}
export default Parent;