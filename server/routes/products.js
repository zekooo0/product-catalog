const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  createProductValidator,
  updateProductValidator,
  getProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Get all products with optional filtering and search
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductValidator, getProduct);

// Create product (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  // createProductValidator,
  upload.single("image"),
  createProduct
);

// Update product (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateProductValidator,
  upload.single("image"),
  updateProduct
);

// Delete product (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProductValidator,
  deleteProduct
);

module.exports = router;
