const { body, param } = require('express-validator');

exports.createCategoryValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
];

exports.updateCategoryValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
];

exports.deleteCategoryValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid category ID')
];
