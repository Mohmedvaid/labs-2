const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('views/html'));
app.use(express.json());
app.use(cookieParser());

// database connection
const dbURI = 'mongodb+srv://mohmed:LYXclVfudZkF6dH5@node-website.yjbwy.mongodb.net/Tests?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(4000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/home.html'));
});
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
