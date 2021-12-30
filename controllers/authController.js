const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require('mongoose');

function isMongooseError(err) {
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.ValidatorError) return true;
  return false;
}

// handle errors
const handleErrors = (err, res) => {
  if (isMongooseError(err)) return res.status(400).json({ error: err.message });
  if (err.message === 'Invalid Credentials') return res.status(401).json({ error: err.message });
  if (err.message.includes('duplicate key error') && 'email' in err.keyValue) return res.status(400).json({ error: 'Email already registered' });
  console.log(err.message);
  return res.status(500).json({ error: 'Something went wrong' });
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/html/register.html'));
};

module.exports.login_get = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/html/login.html'));
};

module.exports.signup_post = async (req, res) => {
  const { email, password, location, firstName, lastName } = req.body;

  try {
    if (!email || !password || !location || !firstName || !lastName) return res.status(400).json({ error: 'All the fields are required!' });
    if (password.length <= 5) return res.status(400).json({ error: 'Minimum password length is 6 characters' });
    const user = await User.create({ email, password, location, firstName, lastName });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie('location', user.location, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, location: user.location, firstName: user.firstName });
  } catch (err) {
    return handleErrors(err, res);
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie('location', user.location, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, location: user.location });
  } catch (err) {
    return handleErrors(err, res);
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
