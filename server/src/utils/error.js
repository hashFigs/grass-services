const logger = require('pino')();

const sendError = (res, err) => {
  logger.error(err);
  const code = err.code ? err.code : -1;
  let message = err.message;
  if (process.env.PRODUCTION === 'true' && code < 0) {
    message = '';
  }
  const status = err.status ? err.status : 400;
  const objResponse = {
    status: 'Failed',
    code,
    error: message,
  };
  res.status(status).send(objResponse);
};

const throwError = (message, code, status = 400) => {
  const e = new Error(message);
  e.code = code;
  e.status = status;
  throw e;
};

module.exports = { sendError, throwError };