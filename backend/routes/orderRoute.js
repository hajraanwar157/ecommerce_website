const express = require("express");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth.js");
const {
  newOrder,
  singleOrderDetail,
  myOrderDetail,
  AllOrderDetail,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController.js");
router = express.Router();
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, singleOrderDetail);
router.route("/orders/me").get(isAuthenticatedUser, myOrderDetail);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRole("admin"), AllOrderDetail);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);
module.exports = router;
