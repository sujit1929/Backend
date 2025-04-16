const Product = require('../models/productModel');

// Create a product (with form-data)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      stock
    } = req.body;

    const images = req.files?.map((file) => ({
      public_id: file.originalname,
      url: `uploads/${file.originalname}` // Update to Cloudinary URL if needed
    })) || [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.files?.length > 0) {
      updateData.images = req.files.map((file) => ({
        public_id: file.originalname,
        url: `uploads/${file.originalname}`
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
