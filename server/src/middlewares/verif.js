const express = require('express');
require('jsonwebtoken');
require('mongoose');
const User = require('../models/users');

require('../models/sessions');

const userVerified = express.Router();

userVerified.use(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && user.isVerified === false) {
    return res.status(406).send({
      status: 'Failed',
      code: 0,
      error: 'Please verify email before log in',
    });
  }
  return next();
});
module.exports = userVerified;
