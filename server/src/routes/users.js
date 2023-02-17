const router = require('express').Router();
const { Validator } = require('express-json-validator-middleware');

// Controllers
const UserController = require('../controllers/users');

// Schemas & Middlewares
const registerSchema = require('../schemas/register');
const loginSchema = require('../schemas/login');
const userProtected = require('../middlewares/auth');
const userVerified = require('../middlewares/verif');

// Utils
const { sendError } = require('../utils/error');

const { validate } = new Validator();



router.post('/v2/register', validate({ body: registerSchema }), async (req, res) => {
    UserController.register(req.body)
      .then((result) => res.status(201).json(result))
      .catch((e) => sendError(res, e));
  });


router.post('/v2/login', userVerified, validate({ body: loginSchema }), async (req, res) => {
    UserController.login(req.body)
      .then((result) => res.json(result))
      .catch((e) => sendError(res, e));
  });
  
router.post('/v2/verifyEmail/:veriToken', async (req, res) => {
    UserController.verifyEmail(req.params.veriToken)
      .then((result) => res.status(201).json(result))
      .catch((e) => sendError(res, e));
  });

router.put('/v2/updatePassword/:passwToken', async (req, res) => {
    UserController.updatePassword(req.body.password, req.params.passwToken)
      .then((result) => res.status(201).json(result))
      .catch((e) => sendError(res, e));
  });  

router.post('/v2/sendEmailPassUpdate', async (req, res) => {
    UserController.sendEmailPasswordUpdate(req.body)
      .then((result) => res.status(201).json(result))
      .catch((e) => sendError(res, e));
  }); 
  
router.get('/v2/', userProtected(), async (req, res) => {
    UserController.getUser(req.context.user._id)
      .then((result) => res.status(200).json(result))
      .catch((e) => sendError(res, e));
  });  

  module.exports = router;