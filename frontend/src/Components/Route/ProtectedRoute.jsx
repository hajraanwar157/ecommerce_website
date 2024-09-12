import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, isAdmin }) {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <>
      {loading === false &&
        (isAuthenticated === false ? (
          <Navigate to="/login" />
        ) : isAdmin === true && user.role !== "admin" ? (
          <Navigate to="/login" />
        ) : (
          children
        ))}
    </>
  );
}

export default ProtectedRoute;
