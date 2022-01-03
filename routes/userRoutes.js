const router = require('express').Router();
const userDB = require('../models/User');
const isValidMongoID = require('../helpers/isValidMongoID');
const { checkUser, isAdmin, requireAuth } = require('../middleware/authMiddleware');

router.get('/api/users', requireAuth, isAdmin, (req, res) => {
    return userDB
      .find({})
      .then((users) => res.json(users))
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
      });
});

module.exports = router;
