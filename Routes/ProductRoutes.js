const express = require("express");

const {
  getAllProducts,
  getSingleProduct,
  addNewProduct,
  updateProduct,
  deleteProduct
} = require("../Controller/ProductController");

const authMiddleware = require("../MiddleWare/authMiddleware");
const adminMiddleware = require("../MiddleWare/adminMiddleware");
const upload = require("../MiddleWare/imageMiddleware");

const router = express.Router();


router.get("/products", getAllProducts);


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
  updateProduct
);


router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;