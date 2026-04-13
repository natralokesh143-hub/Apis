const express = require("express");

const {
  getAllProducts,
  getSingleProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  addOrUpdateReview,
  deleteReview
} = require("../Controller/ProductController");

const authMiddleware = require("../MiddleWare/authMiddleware");
const adminMiddleware = require("../MiddleWare/adminMiddleware");
const upload = require("../MiddleWare/imageMiddleware");

const router = express.Router();

/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Private
 */
router.get("/products", authMiddleware, getAllProducts);

/**
 * @route   GET /products/:id
 * @desc    Get single product
 * @access  Private (Admin)
 */
router.get("/products/:id", authMiddleware, getSingleProduct);

/**
 * @route   GET /products/:id/reviews
 * @desc    Get product reviews + rating summary
 * @access  Private
 */
router.get("/products/:id/reviews", authMiddleware, getProductReviews);

/**
 * @route   POST /products/:id/reviews
 * @desc    Add or update logged-in user's review
 * @access  Private
 */
router.post("/products/:id/reviews", authMiddleware, addOrUpdateReview);

/**
 * @route   DELETE /products/:id/reviews/:reviewId
 * @desc    Delete a review (owner or admin)
 * @access  Private
 */
router.delete("/products/:id/reviews/:reviewId", authMiddleware, deleteReview);

/**
 * @route   POST /products
 * @desc    Add new product
 * @access  Private (Admin)
 */
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addNewProduct
);

/**
 * @route   PUT /products/:id
 * @desc    Update product
 * @access  Private (Admin)
 */
router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"), // allows image update
  updateProduct
);

/**
 * @route   DELETE /products/:id
 * @desc    Delete product
 * @access  Private (Admin)
 */
router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;