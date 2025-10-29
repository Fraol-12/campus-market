// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Passport Config
require('./config/passport')(passport);
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));