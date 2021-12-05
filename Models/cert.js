const mongoose = require('mongoose')

const schema = mongoose.Schema({
    cert: {
      type: String,
      required: true,
      trim: true
    }
})

module.exports = mongoose.model('cert', schema)
