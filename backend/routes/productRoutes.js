// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// ---------- Multer (image upload) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------- PUBLIC: GET all (or by category) ----------
router.get('/', async (req, res) => {
  try {
    const query = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(query).select('-__v');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- PROTECTED: GET seller's own products ----------
router.get('/mine', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).select('-__v');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- PROTECTED: CREATE ----------
// backend/routes/productRoutes.js  (only the POST part)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, price, description, category, contact } = req.body;
    const images = req.files.map(f => f.path);

    const product = new Product({
      title,
      price,
      description,
      category,
      contact,
      images,
      user: req.user.id,          // <-- SAVE OWNER
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------- PROTECTED: UPDATE ----------
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ---- owner check ----
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, price, description, category, contact } = req.body;
    const newImages = req.files.length ? req.files.map(f => f.path) : undefined;

    const update = {
      title,
      price,
      description,
      category,
      contact,
    };
    if (newImages) update.images = newImages;   // replace images only if uploaded

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------- PROTECTED: DELETE ----------
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ---- owner check ----
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;