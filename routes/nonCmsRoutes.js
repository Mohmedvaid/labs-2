const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/front-end-pages/covid-care.html'));
});
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/front-end-pages/about.html'));
});
router.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/front-end-pages/blog.html'));
});
router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/front-end-pages/contact.html'));
});
router.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/front-end-pages/services.html'));
});
module.exports = router;
