// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ---------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Existing user?
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        return res.status(400).json({ msg: 'Please verify the email we already sent.' });
      }
      return res.status(400).json({ msg: 'User already exists.' });
    }

    // 2. Create new user
    user = new User({
      name,
      email,
      password,
      verificationToken: crypto.randomBytes(20).toString('hex'),
    });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // 4. Email – **use your public ngrok URL** (or localhost for Postman)
    const verifyURL = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify/${user.verificationToken}`;

    await sendEmail(
      user.email,
      'Verify Your Email – Campus Marketplace',
      `<h3>Welcome, ${name}!</h3>
       <p>Click the button below to verify your email:</p>
       <a href="${verifyURL}" style="display:inline-block;padding:10px 20px;background:#2c7;color:white;text-decoration:none;border-radius:4px;">Verify Email</a>
       <p><small>Or copy-paste this link: <code>${verifyURL}</code></small></p>`
    );

    res.json({ msg: 'Check your email – click the link to verify.' });
  } catch (err) {
    console.error('REGISTER ERROR →', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------------------------------------------
// GET /api/auth/verify/:token   ← **HTML page**
// ---------------------------------------------------
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).send(`
        <h2>Invalid or expired token</h2>
        <p><a href="/api/auth/register">Register again</a></p>
      `);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Simple success page – copy-paste into Postman works too
    res.send(`
      <h2 style="color:green;">Email Verified!</h2>
      <p>You can now log in.</p>
      <hr/>
      <h4>Test login with Postman / cURL</h4>
      <pre>
POST ${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/login
Content-Type: application/json

{
  "email": "${user.email}",
  "password": "YOUR_PASSWORD_HERE"
}
      </pre>
    `);
  } catch (err) {
    console.error('VERIFY ERROR →', err);
    res.status(500).send('<h2>Server error</h2>');
  }
});

// ---------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials.' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('LOGIN ERROR →', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------------------------------------------
// Google OAuth (unchanged)
// ---------------------------------------------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// backend/routes/authRoutes.js   (replace the whole Google block)

// backend/routes/authRoutes.js → Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ONLY SEND TOKEN
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);


router.get('/me', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error();
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
});

module.exports = router;