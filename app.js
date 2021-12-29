const express = require('express')
//const router = require('express').Router();
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const customerRoutes = require('./routes/customerRoutes')
const nonCmsRoutes = require('./routes/nonCmsRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
require('dotenv').config()
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

// middleware
app.use(express.static('views/html'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use("/uploads", express.static('uploads'))
app.use(express.static('views/front-end-pages'));

// database connection
mongoose
	.connect(process.env.MONGODB_URI || 'mongodb://localhost/lab', {
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then((res) => console.log('Connected to db!'))

// routes
app.get('*', checkUser)

//app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes)
app.use(customerRoutes)
app.use(nonCmsRoutes)

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`)
})

// const path = require('path');
// const nodeExternals = require('webpack-node-externals');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// module.exports = {
//   mode: 'development',
//   entry: './app.js',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   target: 'node',
//   externals: [nodeExternals()],
//   module: {
//     rules: [
//       {
//         test: /\.html$/i,
//         loader: 'html-loader',
//       },
//     ],
//   },
//   plugin: [new BundleAnalyzerPlugin()],
//   devServer: {
//     contentBase: path.join(__dirname, 'dist'),
//     port: 9000,
//   },
// };

