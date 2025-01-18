const Product = require("../models/Product");
const Category = require("../models/Category");
const { validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary");
const DatauriParser = require("datauri/parser");
const path = require("path");
const parser = new DatauriParser();

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);
    const result = await cloudinary.uploader.upload(file64.content);
    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading to Cloudinary");
  }
};

// Helper function to validate image URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Helper function to get Cloudinary public ID from URL
const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    // Extract the public ID from the URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.ext
    const urlParts = url.split("/");
    const publicIdWithExt = urlParts[urlParts.length - 1];
    // Remove the file extension
    const publicId = publicIdWithExt.split(".")[0];
    return publicId;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};

// Get all products with optional filtering and search
exports.getProducts = async (req, res) => {
  try {
    let query = {};
    console.log(req.query);
    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category });
      if (category) {
        query.categories = category._id;
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
      .populate("categories")
      .sort(req.query.sort || "-createdAt");

    res.json(products);
  } catch (error) {
    console.error("Error in products route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageURL = req.body.imageURL;

    // Handle file upload if present
    if (req.file) {
      imageURL = await uploadToCloudinary(req.file);
    } else if (!isValidUrl(imageURL)) {
      return res
        .status(400)
        .json({
          message: "Please provide a valid image URL or upload an image file",
        });
    }

    // Parse JSON strings from FormData if they exist
    const categories = typeof req.body.categories === 'string' 
      ? JSON.parse(req.body.categories) 
      : req.body.categories;
    
    const reviewers = typeof req.body.reviewers === 'string'
      ? JSON.parse(req.body.reviewers)
      : req.body.reviewers;
    
    const keywords = typeof req.body.keywords === 'string'
      ? JSON.parse(req.body.keywords)
      : req.body.keywords;

    const {
      domainName,
      url,
      description,
      rating,
      freeTrial,
    } = req.body;

    // Handle categories - create if they don't exist and get their IDs
    const categoryIds = [];
    for (const categoryObj of categories) {
      let categoryDoc = await Category.findOne({ name: categoryObj.name });
      if (!categoryDoc) {
        // Create new category if it doesn't exist
        categoryDoc = await Category.create({ name: categoryObj.name });
      }
      categoryIds.push(categoryDoc._id);
    }

    // Transform the data to match the schema
    const productData = {
      imageURL,
      domainName,
      url,
      description,
      rating: Number(rating),
      freeTrialAvailable: freeTrial === 'true' || freeTrial === true,
      reviewers,
      keywords,
      categories: categoryIds,
    };
    console.log(productData);
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error in create product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Handle file upload if present
    if (req.file) {
      updateData.imageURL = await uploadToCloudinary(req.file);
    } else if (req.body.imageURL && !isValidUrl(req.body.imageURL)) {
      return res
        .status(400)
        .json({
          message: "Please provide a valid image URL or upload an image file",
        });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in update product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary if it exists
    const publicId = getCloudinaryPublicId(product.imageURL);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with product deletion even if Cloudinary deletion fails
      }
    }

    // Delete the product
    await product.deleteOne();

    // Delete orphaned categories
    for (const categoryId of product.categories) {
      const productsInCategory = await Product.countDocuments({
        categories: categoryId,
      });
      if (productsInCategory === 0) {
        await Category.findByIdAndDelete(categoryId);
      }
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in delete product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
