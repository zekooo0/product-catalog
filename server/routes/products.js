const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { protect, authorize } = require("../middleware/auth");

// Get all products with optional filtering and search
router.get("/", async (req, res) => {
  try {
    let query = {};
    console.log(req.query);
    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    // Letter filter
    if (req.query.letter) {
      query.domainName = {
        $regex: `^${req.query.letter}`,
        $options: "i",
      };
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Rating filter
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Free trial filter
    if (req.query.freeTrialAvailable) {
      query.freeTrialAvailable = req.query.freeTrialAvailable === "true";
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort(req.query.sort || "-createdAt");

    res.json(products);
  } catch (error) {
    console.error("Error in products route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create product (admin only)
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      imageUrl,
      domainName,
      url,
      description,
      rating,
      freeTrial,
      reviewers,
      keywords,
      category,
    } = req.body;

    // Handle categories - create if they don't exist and get their IDs
    const categoryIds = [];
    for (const categoryName of category) {
      let category = await Category.findOne({ name: categoryName });
      if (!category) {
        category = await Category.create({ name: categoryName });
      }
      categoryIds.push(category._id);
    }

    // Transform the data to match the schema
    const productData = {
      imageURL: imageUrl,
      domainName,
      url,
      description,
      rating,
      freeTrialAvailable: freeTrial,
      reviewers,
      keywords,
      category: categoryIds,
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// Update product (admin only)
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    for (const categoryId of product.category) {
      const productsInCategory = await Product.countDocuments({
        category: categoryId,
      });
      if (productsInCategory === 1) {
        await Category.findByIdAndDelete(categoryId);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
