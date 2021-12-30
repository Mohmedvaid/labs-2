const { Router } = require('express');
const path = require('path');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = Router();


router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/html/dashboard.html'));
});
router.get('/customers', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/html/customers.html'));
});

router.get('/edit-customer', requireAuth, (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.redirect('/login');
    } else {
      let user = await User.findById(decodedToken.id);
      if (user.location.toLowerCase() === 'all') {
        return res.sendFile(path.join(__dirname, '../views/html/edit-customer.html'));
      } else {
        return res.redirect('/dashboard');
      }
    }
  });
  //res.sendFile(path.join(__dirname, '../views/html/edit-customer.html'))
});

module.exports = router;