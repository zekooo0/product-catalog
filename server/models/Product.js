const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    imageURL: {
      type: String,
      required: true,
    },
    domainName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
      required: true,
    },
    freeTrialAvailable: {
      type: Boolean,
      default: false,
    },
    reviewers: [
      {
        name: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    category: [
      {
        type: String,
        ref: "Category",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
productSchema.index({
  name: "text",
  description: "text",
  keywords: "text",
  reviewedBy: "text",
});

module.exports = mongoose.model("Product", productSchema);
