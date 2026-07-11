import "./ProductCard.css";

function ProductCard({ name, price, brand, inStock }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Price: Rs. {price}</p>
      <p>Brand: {brand}</p>
      <p style={{ color: inStock ? "green" : "red" }}>
        {inStock ? "Available" : "Out of Stock"}
      </p>
    </div>
  );
}

export default ProductCard;