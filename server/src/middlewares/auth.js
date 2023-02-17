const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/users');
//const Company = require('../models/companies');
//const Project = require('../models/projects');
const Session = require('../models/sessions');

const userProtected = (params) => {
  return (req, res, next) => {
    // console.log(1);
    if (!req.headers.authorization) {
      if (!!params && params.trustworthy) {
        let origin = req.headers.origin || null;
        console.log('origin', origin);
        switch (origin) {
          case 'http://localhost:3000':
          case 'http://localhost:3001':
            return next();
          default:
            break;
        }
      }
      return res.status(401).send();
    }
    // console.log(2);
    const auth = req.headers.authorization.split(' ');
    if (auth[1]) {
      // console.log(3);
      jwt.verify(auth[1], process.env.TOKEN_SECRET, async (err, decoded) => {
        // console.log(4);
        if (err) {
          console.log('err', err);
          return res.status(401).send();
        }
        // console.log(5);
        const session = await Session.findOne({
          token: auth[1],
        });
        if (!session) return res.status(401).send();
        // console.log(6);
        if (session.userId.toString() !== decoded.userId || session.expiresAt < new Date()) return res.status(401).send();
        // Check user, project and company..
        req.context = {};
        req.context.user = await User.findOne({ _id: session.userId });
        // console.log(7);
        
        if (!req.context.user) return res.status(401).send();
   //     req.context.company = await Company.findOne({ _id: req.context.user.companyId });
    //    if (!!decoded.projectId) {
   //       if (!req.context.company) return res.status(401).send();
   //       req.context.project = await Project.findOne({
   //         _id: mongoose.Types.ObjectId(decoded.projectId),
   //         companyId: req.context.user.companyId,
   //       });
          // Check for bad ids.
   //       if (!req.context.project) return res.status(401).send();
          // User from different company.
  //        if (req.context.project.companyId.toString() !== req.context.company._id.toString()) return res.status(401).send();
   //     }
        return next();
      });
    } else {
      return res.status(401).send();
    }
  }
}

module.exports = userProtected;
