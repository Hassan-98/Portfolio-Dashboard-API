const mongoose = require('mongoose')

const schema = mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    }
})

module.exports = mongoose.model('contact', schema)
