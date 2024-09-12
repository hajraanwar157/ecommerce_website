import Header from "./Components/Layout/Header/Header";
import Footer from "./Components/Layout/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home.jsx";
import ProductDetails from "./Components/Product/ProductDetails.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./Components/Product/Products.jsx";
import Search from "./Components/Product/Search.jsx";
import LoginSignup from "./Components/User/LoginSignup.jsx";
import { loadUser } from "./actions/userAction.jsx";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserOptions from "./Components/Layout/Header/UserOptions.jsx";
import Profile from "./Components/User/Profile.jsx";
import ProtectedRoute from "./Components/Route/ProtectedRoute.jsx";
import UpdateProfile from "./Components/User/UpdateProfile.jsx";
import UpdatePassword from "./Components/User/UpdatePassword.jsx";
import ForgotPassword from "./Components/User/ForgotPassword.jsx";
import ResetPassword from "./Components/User/ResetPassword.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import Shipping from "./Components/Cart/Shipping.jsx";
import ConfirmOrder from "./Components/Cart/ConfirmOrder.jsx";
import axios from "axios";
import Payment from "./Components/Cart/Payment.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./Components/Cart/OrderSuccess.jsx";
import MyOrders from "./Components/Order/MyOrders.jsx";
import OrderDetails from "./Components/Order/OrderDetails.jsx";
import Dashboard from "./Components/Admin/Dashboard.jsx";
import ProductList from "./Components/Admin/ProductList.jsx";
import NewProduct from "./Components/Admin/NewProduct.jsx";
import UpdateProduct from "./Components/Admin/UpdateProduct.jsx";
import OrderList from "./Components/Admin/OrderList.jsx";
import ProcessOrder from "./Components/Admin/ProcessOrder.jsx";
import UserList from "./Components/Admin/UserList.jsx";
import UpdateUser from "./Components/Admin/UpdateUser.jsx";
import ProductReviews from "./Components/Admin/ProductReviews.jsx";
import Contact from "./Components/Layout/Contact/Contact.jsx";
import About from "./Components/Layout/About/About.jsx";
import NotFound from "./Components/Layout/Not Found/NotFound.jsx";
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get(
      "http://localhost:5000/api/v1/stripeapikey",
      {
        withCredentials: true,
      }
    );
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    dispatch(loadUser());
    getStripeApiKey();
  }, [dispatch]);
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/product/:id" element={<ProductDetails />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/about" element={<About />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path="/login" element={<LoginSignup />} />
          <Route
            exact
            path="/account"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/me/update"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/password/update"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />
          <Route exact path="/cart" element={<Cart />} />
          <Route
            exact
            path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/order/confirm"
            element={
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path="/process/payment"
            element={
              stripeApiKey && (
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                </Elements>
              )
            }
          />
          <Route
            exact
            path="/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/products"
            element={
              <ProtectedRoute isAdmin={true}>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/product"
            element={
              <ProtectedRoute isAdmin={true}>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/product/:id"
            element={
              <ProtectedRoute isAdmin={true}>
                <UpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/orders"
            element={
              <ProtectedRoute isAdmin={true}>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/order/:id"
            element={
              <ProtectedRoute isAdmin={true}>
                <ProcessOrder />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/user/:id"
            element={
              <ProtectedRoute isAdmin={true}>
                <UpdateUser />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/reviews"
            element={
              <ProtectedRoute isAdmin={true}>
                <ProductReviews />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
