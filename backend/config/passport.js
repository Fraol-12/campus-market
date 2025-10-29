// backend/config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          isVerified: true,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: newUser.email });
            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              user = await new User(newUser);
              await user.save();
            }
          }
          // DON'T CALL done() with session
          // Just return user
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // These are required but we don't use them
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};