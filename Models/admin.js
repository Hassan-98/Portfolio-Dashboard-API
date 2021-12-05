const mongoose = require('mongoose')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
})

module.exports = mongoose.model('admin', schema)
