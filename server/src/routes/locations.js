const router = require('express').Router();
const { Validator } = require('express-json-validator-middleware');

// Controllers
const LocationController = require('../controllers/locations');
// Schemas & Middlewares
const locationSchema = require('../schemas/locations');
const userProtected = require('../middlewares/auth');
// Utils
const { sendError } = require('../utils/error');

const { validate } = new Validator();

router.post('/v2/', userProtected(), validate({ body: locationSchema }), async (req, res) => {
    LocationController.addLocation(req.context.user, req.body)
      .then((result) => res.status(201).json(result))
      .catch((e) => sendError(res, e));
  });

  router.get('/v2/', userProtected(), async (req, res) => {
    LocationController.addLocation(req.context.user, req.body)
      .then((result) => res.status(201).json(result))
      .catch((e) => sendError(res, e));
  });  

  module.exports = router;