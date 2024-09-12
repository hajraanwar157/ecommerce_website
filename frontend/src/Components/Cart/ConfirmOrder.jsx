import React from "react";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../Layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import "./ConfirmOrder.css";
import { Typography } from "@mui/material";
function ConfirmOrder() {
  const navigate = useNavigate();
  const { shippingInfo, cartItemsUser } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subTotal = cartItemsUser.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = subTotal > 1000 ? 0 : 200;
  const tax = subTotal * 0.18;
  const totalPrice = tax + subTotal + shippingCharges;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      shippingCharges,
      tax,
      subTotal,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };
  return (
    <>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirm-order-page">
        <div>
          <div className="confirm-shipping-area">
            <Typography>Shipping Info</Typography>
            <div className="confirm-shipping-area-box">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirm-cart-items">
            <Typography>Your cart items:</Typography>
            <div className="confirm-cartItems-cntainer">
              {cartItemsUser &&
                cartItemsUser.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="product " />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <span>
                      {item.quantity} X Rs.{item.price} ={" "}
                      <b>Rs.{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className="order-summary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>Rs.{subTotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>Rs.{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>Rs.{tax}</span>
              </div>
            </div>

            <div className="order-summary-total">
              <p>
                <b>Total:</b>
              </p>
              <span>Rs.{totalPrice}</span>
            </div>
            <button onClick={proceedToPayment}>Proceed to payment</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmOrder;
