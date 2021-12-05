const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    dateFrom: {
      type: String,
      required: true
    },
    dateTo: {
      type: String
    },
    type: {
      type: String,
      required: true,
      trim: true
    }
})

module.exports = mongoose.model('Exp', schema)
