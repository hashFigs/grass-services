const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user',
  },
  balance: { type: String, default: '0' },
  isVerified: { type: Boolean, default: false },
  urlVeri: String,
  passwToken: { type: String, default: '' },
  expiresPassw: { type: Date },
  expiresVeri: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  //companyId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Appointment', schema);
