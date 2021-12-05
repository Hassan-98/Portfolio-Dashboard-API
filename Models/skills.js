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
    }
})

module.exports = mongoose.model('skill', schema)
