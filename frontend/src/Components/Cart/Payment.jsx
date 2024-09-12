import { useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps.jsx";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../Layout/MetaData.jsx";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Payment.css";
import { CreditCard, Event, VpnKey } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { clearErrors, createOrder } from "../../actions/orderAction.jsx";
import { EMPTY_SHIPPING_INFO } from "../../constants/cartConstants.jsx";
function Payment() {
  const { shippingInfo, cartItemsUser } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const navigate = useNavigate();
  const payBtn = useRef(null);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };
  const order = {
    shippingInfo,
    orderItems: cartItemsUser,
    itemsPrice: orderInfo.subTotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };
  async function submitHandler(e) {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {
      const config = {
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payment/process",
        paymentData,
        config
      );
      const client_secret = data.client_secret;
      if (!stripe || !elements) {
        return;
      }
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          localStorage.removeItem(`cart-${user._id}`);
          localStorage.removeItem("shippingInfo");
          dispatch({ type: EMPTY_SHIPPING_INFO });
          dispatch(createOrder(order));
          navigate("/success");
        } else {
          toast.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response.data.error);
    }
  }
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, toast]);
  return (
    <>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="payment-container">
        <form className="payment-form" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCard />
            <CardNumberElement className="payment-input" />
          </div>
          <div>
            <Event />
            <CardExpiryElement className="payment-input" />
          </div>
          <div>
            <VpnKey />
            <CardCvcElement className="payment-input" />
          </div>
          <input
            type="submit"
            value={`Pay - ${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="payment-btn"
          />
        </form>
      </div>
    </>
  );
}

export default Payment;
