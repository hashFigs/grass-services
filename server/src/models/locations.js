const mongoose = require('mongoose');

const schema = mongoose.Schema({
  address1: String,
  city: String,
  zipCode: String,
  userId: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Location', schema);
