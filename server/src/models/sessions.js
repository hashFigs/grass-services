const mongoose = require('mongoose');

const schema = mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  userId: mongoose.Schema.Types.ObjectId,
  projectId: mongoose.Schema.Types.ObjectId,
  contractId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['user', 'project'], default: 'user', },
});

module.exports = mongoose.model('Session', schema);
