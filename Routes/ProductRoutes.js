const express = require("express");

const {
  getAllProducts,
  getSingleProduct,
  addNewProduct,
  updateProduct,
  deleteProduct
} = require("../Controller/ProductController");

const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const upload = require("../Middleware/imageMiddleware");

const router = express.Router();


router.get("/products", authMiddleware, getAllProducts);


router.get("/products/:id", authMiddleware, getSingleProduct);


router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addNewProduct
);

router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"), // allows image update
  updateProduct
);


router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;