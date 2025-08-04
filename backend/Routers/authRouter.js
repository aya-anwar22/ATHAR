const express = require('express');
const router = express.Router()
const authControllers = require('../controllers/authControllers')
const passport = require('passport');


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  authControllers.googleAuthCallback
);



router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/sign-up', authControllers.register)
router.post('/verify-email', authControllers.verifyEmail)
router.post('/login', authControllers.login)
router.post('/forget-password', authControllers.forgetPassword)
router.post('/rest-password', authControllers.resetPassword)
router.post('/refresh-token', authControllers.refreshToken)
router.post('/logout', authControllers.logout)


module.exports = router;