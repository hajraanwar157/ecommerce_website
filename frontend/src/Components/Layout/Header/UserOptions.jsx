import { useState, useEffect } from "react";
import "./Header.css";
import { SpeedDialAction, SpeedDial } from "@mui/material";
import { Backdrop } from "@mui/material";
import profileImg from "../../../assets/Profile.png";
import { Person, ExitToApp, ListAlt, Dashboard } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../../actions/userAction";
import { ShoppingCart } from "@mui/icons-material";
function UserOptions({ user }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const options = [
    { icon: <Person />, name: "Profile", func: account },
    { icon: <ListAlt />, name: "Orders", func: orders },
    {
      icon: <ShoppingCart />,
      name: "Cart",
      func: cart,
    },
    { icon: <ExitToApp />, name: "Logout", func: logoutUser },
  ];
  if (user.role === "admin") {
    options.unshift({
      icon: <Dashboard />,
      name: "Dashboard",
      func: dashboard,
    });
  }
  function cart() {
    navigate("/cart");
  }
  function dashboard() {
    navigate("/admin/dashboard");
  }
  function orders() {
    navigate("/orders");
  }
  function account() {
    navigate("/account");
  }
  function orders() {
    navigate("/orders");
  }
  function logoutUser() {
    dispatch(logout());
    toast.success("logout successfully");
  }

  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        className="speeddial"
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        style={{ zIndex: "11" }}
        direction="down"
        icon={
          <img
            src={user.avatar.url ? user.avatar.url : profileImg}
            alt=""
            className="speedDialIcon"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            // tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </>
  );
}

export default UserOptions;
