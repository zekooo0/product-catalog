const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const {
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../validators/categoryValidator');

// Get all categories
router.get('/', getCategories);

// Create category (admin only)
router.post(
    '/',
    protect,
    authorize('admin'),
    createCategoryValidator,
    createCategory
);

// Update category (admin only)
router.put(
    '/:id',
    protect,
    authorize('admin'),
    updateCategoryValidator,
    updateCategory
);

// Delete category (admin only)
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    deleteCategoryValidator,
    deleteCategory
);

module.exports = router;
