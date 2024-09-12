import React, { useEffect, useState } from "react";
import "./ForgotPassword.css";
import Loader from "../Layout/Loader/Loader";
import { MailOutline } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, forgotPassword } from "../../actions/userAction.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData.jsx";
function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );
  const [email, setEmail] = useState("");
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("email", email);
    dispatch(forgotPassword(myform));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, toast, error, message]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Forgot Password" />
          <div className="forgotPassword-container">
            <div className="forgotPassword-box">
              <h2>Forgot Password</h2>
              <form
                className="forgotPassword-form"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="forgotPassword-email">
                  <MailOutline />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <input
                  type="submit"
                  value="Send"
                  className="forgotPassword-btn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ForgotPassword;
