import { useEffect, useState } from "react";
import "./ResetPassword.css";
import Loader from "../Layout/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction.jsx";
import { LockOpen, Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MetaData from "../Layout/MetaData.jsx";

function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("password", password);
    myform.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, myform));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Password updated successfully");

      navigate(`/login`);
    }
  }, [dispatch, error, success]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Change Password" />
          <div className="resetPassword-container">
            <div className="resetPassword-box">
              <h2>Update Password</h2>
              <form
                className="resetPassword-form"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpen />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    required
                    name="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <Lock />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    required
                    name="password"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                <input
                  type="submit"
                  value="Reset"
                  className="resetPassword-btn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ResetPassword;
