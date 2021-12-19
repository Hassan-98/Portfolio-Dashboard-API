const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: Number,
      required: true,
      default: 0
    }
})

module.exports = mongoose.model('skill', schema)
