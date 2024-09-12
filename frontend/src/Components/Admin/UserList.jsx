import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import {
  getAllUsers,
  clearErrors,
  deleteUser,
} from "../../actions/userAction.jsx";
import "./ProductList.css";
import MetaData from "../Layout/MetaData";
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import Sidebar from "./Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { DELETE_USER_RESET } from "../../constants/userConstants.jsx";
function UserList() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.user);
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    if (user.role === "admin" && user._id === id) {
      toast.error("Cannot delete current admin");
    } else {
      dispatch(deleteUser(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, toast, error, deleteError, navigate, isDeleted, message]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.5 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.row.role === "admin" ? "green-color" : "red-color";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/user/${params.row.id}`}>
              <Edit />
            </Link>

            <Button onClick={() => deleteUserHandler(params.row.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];
  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });
  return (
    <>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
          />
        </div>
      </div>
    </>
  );
}

export default UserList;
