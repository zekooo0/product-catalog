const { body, query, param } = require("express-validator");

exports.createProductValidator = [
  // body("imageUrl")
  //   .isURL()
  //   .withMessage("Please provide a valid image URL"),
  body("url").isURL().withMessage("Please provide a valid product URL"),
  body("description")
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("rating")
    .isFloat({ min: 1, max: 10 })
    .withMessage("Rating must be between 1 and 10"),
  body("freeTrial")
    .isBoolean()
    .withMessage("Free trial must be a boolean value"),
  body("reviewers").isArray().withMessage("Reviewers must be an array"),
  body("reviewers.*.name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Reviewer name is required"),
  body("reviewers.*.url")
    .isURL()
    .withMessage("Please provide a valid reviewer URL"),
  body("keywords").isArray().withMessage("Keywords must be an array"),
  body("keywords.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each keyword must be a non-empty string"),
  body("categories").isArray().withMessage("Categories must be an array"),
  body("categories.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each category must be a non-empty string"),
];

exports.updateProductValidator = [
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid image URL"),
  body("url")
    .optional()
    .isURL()
    .withMessage("Please provide a valid product URL"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("rating")
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage("Rating must be between 1 and 10"),
  body("freeTrial")
    .optional()
    .isBoolean()
    .withMessage("Free trial must be a boolean value"),
  body("reviewers")
    .optional()
    .isArray()
    .withMessage("Reviewers must be an array"),
  body("reviewers.*.name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Reviewer name is required"),
  body("reviewers.*.url")
    .optional()
    .isURL()
    .withMessage("Please provide a valid reviewer URL"),
  body("keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),
  body("keywords.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each keyword must be a non-empty string"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
  body("categories.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each category must be a non-empty string"),
];

exports.getProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

exports.deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];
