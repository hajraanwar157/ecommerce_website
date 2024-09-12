import { Rating } from "@mui/material";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
    size: "small",
  };
  return (
    <Link className="product-card" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} />
        <span className="product-card-span">
          ( {product.numOfReviews} Reviews)
        </span>
      </div>
      <span className="product-price">{`Rs.${product.price}`}</span>
    </Link>
  );
}

export default ProductCard;
