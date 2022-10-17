const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

// ENV
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// Connect Mongoose Database
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(() => {
  console.log(`Database connected successfully`)
})

// Cross-Origin Resource Sharing
var corsOptionsDelegate = function (req, callback) {
  // CORS Whitelist URLs
  const whitelist = [process.env.CLIENT_URL_1, process.env.CLIENT_URL_2];

  if (process.env.NODE_ENV !== "production") whitelist.push("http://localhost:3000");

  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true, }
  } else {
    corsOptions = { origin: false, credentials: true, }
  }

  callback(null, corsOptions);
}

app.use(cors(corsOptionsDelegate));

// Disable etag and x-powered-by
app.disable("etag").disable("x-powered-by");
// Setting JSON in Body Of Requests
app.use(express.json())
// FormData Body Parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ 
  limit: '50mb',
  extended: true,
  parameterLimit: 50000 
}));
// Cookie Parser
app.use(cookieParser());
// Req & Res Compressor
app.use(compression());
// Helmet Protector
app.use(helmet());
// Set Morgan Logger
app.use(morgan(':method :url :status - :response-time ms'));


// Import API Endpoints
const statsAPI = require('./API/stats')
const certsAPI = require('./API/certs')
const clientsAPI = require('./API/clients')
const portfolioAPI = require('./API/portfolio')
const expAPI = require('./API/exp')
const skillsAPI = require('./API/skills')
const contactFormAPI = require('./API/contact')
const authAPI = require('./API/auth')


// Set API Endpoints
app.use('/api/stats/', statsAPI)
app.use('/api/certs/', certsAPI)
app.use('/api/clients/', clientsAPI)
app.use('/api/portfolio/', portfolioAPI)
app.use('/api/exps/', expAPI)
app.use('/api/skills/', skillsAPI)
app.use('/api/contact/', contactFormAPI)
app.use('/api/auth/', authAPI)

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));

module.exports = app;
