const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchErrorHandler = require("../middleware/catchAsyncError.js");
//////////////////////////////////////////////////////////////////////
//create a new order
exports.newOrder = catchErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    user: req.user.id,
    paidAt: Date.now(),
  });
  res.status(201).json({
    success: true,
    order,
  });
});
//////////////////////////////////////////////////////////////////////
//get single order details
exports.singleOrderDetail = catchErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
//////////////////////////////////////////////////////////////////////
//get loggedin user order details
exports.myOrderDetail = catchErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});
//////////////////////////////////////////////////////////////////////
//get all order details for admin
exports.AllOrderDetail = catchErrorHandler(async (req, res, next) => {
  const orders = await Order.find();
  let total = 0;
  orders.forEach((order) => {
    total = total + order.totalPrice;
  });
  res.status(200).json({
    success: true,
    total,
    orders,
  });
});
//////////////////////////////////////////////////////////////////////
//update order status for admin
exports.updateOrder = catchErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }
  if (order.orderStatus === "delivered") {
    return next(new ErrorHandler("you have already delivered this order", 400));
  }

  if (req.body.status === "shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;
  if (req.body.status === "delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
//////////////////////////////////////////////////////////////////////
//delete a order for admin
exports.deleteOrder = catchErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "order deleted",
  });
});
