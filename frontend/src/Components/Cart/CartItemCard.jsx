import { Link } from "react-router-dom";
import "./CartItemCard.css";
function CartItemCard({ item, deleteCartItems }) {
  return (
    <>
      <div className="cart-item-card">
        <img src={item.image} alt="image" />
        <div>
          <Link to={`/product/${item.product}`}>{item.name}</Link>
          <span>{`Price: Rs.${item.price}`}</span>
          <p
            onClick={() => {
              deleteCartItems(item.product);
            }}
          >
            Remove
          </p>
        </div>
      </div>
    </>
  );
}

export default CartItemCard;
