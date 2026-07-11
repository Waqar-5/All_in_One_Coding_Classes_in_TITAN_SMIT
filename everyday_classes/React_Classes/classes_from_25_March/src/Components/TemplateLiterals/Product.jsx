function Products({ name, price, discount }) {
  const finalPrice = price - discount;
  return (
    <div className="Products">
      <h2>{`Product: ${name}`}</h2>
      <p>{`Original Price: Rs. ${price}`}</p>
      <p>{`Discount: Rs. ${discount}`}</p>
      <p>{`Final Price: Rs. ${finalPrice}`}</p>
    </div>
  );
}
export default Products;
