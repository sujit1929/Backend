const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// POST with form-data (including file upload)
router.post('/', upload.array('images'), createProduct);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
