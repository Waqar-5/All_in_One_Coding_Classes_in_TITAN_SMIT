import "./Products.css";

function Products() {

  const products = [
    { id: 1, name: "Laptop", price: "$1200" },
    { id: 2, name: "Smartphone", price: "$800" },
    { id: 3, name: "Headphones", price: "$150" },
    { id: 4, name: "Smartwatch", price: "$250" },
    { id: 5, name: "Camera", price: "$600" }
  ];

  return (
    <div className="products-section">

      <h2 className="products-title">Our Products</h2>

      <div className="products-grid">

        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Products;