import React, { useEffect, useState } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  addItemsToCart,
  removeItemFromCart,
  setCartUserItems,
} from "../../actions/cartActions.jsx";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RemoveShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, cartItemsUser } = useSelector((state) => state.cart);
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const [cartItemsMap, setCartItemsMap] = useState([]);
  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };
  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };
  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setCartUserItems()); // Fetch user-specific cart items
    }
  }, [dispatch, isAuthenticated]); // Only run when `isAuthenticated` changes

  useEffect(() => {
    if (isAuthenticated) {
      setCartItemsMap(cartItemsUser); // Update cartItems for authenticated users
    } else {
      setCartItemsMap(cartItems); // Update cartItems for guests
    }
  }, [isAuthenticated, cartItemsUser, cartItems]);
  return (
    <>
      {cartItemsMap.length === 0 ? (
        <div className="empty-cart">
          <RemoveShoppingCart />
          <Typography>No items found in cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-page">
            <div className="cart-header">
              <p>Product</p>
              <p>quantity</p>
              <p>subtotal</p>
            </div>
            {cartItemsMap &&
              cartItemsMap.map((item) => (
                <div className="cart-container" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cart-input">
                    <button
                      onClick={() => {
                        decreaseQuantity(item.product, item.quantity);
                      }}
                    >
                      -
                    </button>
                    <input type="number" readOnly value={item.quantity} />
                    <button
                      onClick={() => {
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-subtotal">{`Rs.${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}
            <div className="cart-gross-total">
              <div></div>
              <div className="cart-gross-box">
                <p>Gross total</p>
                <p>{`Rs.${cartItemsMap.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkout-btn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;
