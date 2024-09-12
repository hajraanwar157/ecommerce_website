import "./OrderSuccess.css";
import { CheckCircle } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
function OrderSuccess() {
  return (
    <div className="order-success">
      <CheckCircle />
      <Typography>Your order has been placed successfully</Typography>
      <Link to="/orders">View orders</Link>
    </div>
  );
}

export default OrderSuccess;
