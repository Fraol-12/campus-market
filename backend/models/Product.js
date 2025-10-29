// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  contact: String,
  images: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // <-- ADD THIS
});

module.exports = mongoose.model('Product', productSchema);