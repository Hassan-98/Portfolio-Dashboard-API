const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();

// ENV
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// Connect Mongoose Database
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
})

// IMPORT APIs
const statsAPI = require('./API/stats')
const certsAPI = require('./API/certs')
const clientsAPI = require('./API/clients')
const portfolioAPI = require('./API/portfolio')
const expAPI = require('./API/exp')
const skillsAPI = require('./API/skills')
const contactFormAPI = require('./API/contact')
const authAPI = require('./API/admin')

// Set Express Configrations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = ["https://admin.hassanali.tk", "https://hassanali.tk"];
    if (whitelist.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  }
}))

// Set APIs
app.use('/api/stats/', statsAPI)
app.use('/api/certs/', certsAPI)
app.use('/api/clients/', clientsAPI)
app.use('/api/portfolio/', portfolioAPI)
app.use('/api/exps/', expAPI)
app.use('/api/skills/', skillsAPI)
app.use('/api/contact/', contactFormAPI)
app.use('/api/auth/', authAPI)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));

module.exports = app;
