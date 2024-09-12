import { useEffect, useState } from "react";
import "./UpdatePassword.css";
import Loader from "../Layout/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { updatePassword, clearErrors } from "../../actions/userAction.jsx";
import { LockOpen, VpnKey, Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants.jsx";
import MetaData from "../Layout/MetaData.jsx";
function UpdatePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("oldPassword", oldPassword);
    myform.set("newPassword", newPassword);
    myform.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(myform));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Password changed successfully");

      navigate(`/account`);
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, isUpdated]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Change Password" />
          <div className="updatePassword-container">
            <div className="updatePassword-box">
              <h2>Update Password</h2>
              <form
                className="updatePassword-form"
                onSubmit={updatePasswordSubmit}
              >
                <div className="signup-password">
                  <VpnKey />
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    required
                    name="password"
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
                  />
                </div>

                <div className="signup-password">
                  <LockOpen />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    required
                    name="password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </div>

                <div className="signup-password">
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
                  value="Change"
                  className="updatePassword-btn"
                  //   disabled={loading ? true : false}
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UpdatePassword;
