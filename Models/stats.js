const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    },
    picture: {
      type: String,
      required: true,
      trim: true
    }
})

module.exports = mongoose.model('stat', schema)
