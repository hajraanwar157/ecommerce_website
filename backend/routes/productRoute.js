const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReviews,
  getProductReviews,
  deleteProductReview,
  getAdminProducts,
} = require("../controllers/productController.js");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth.js");
const router = express.Router();
router.route("/products").get(getAllProducts);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAdminProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRole("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(isAuthenticatedUser, createProductReviews);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);
module.exports = router;
