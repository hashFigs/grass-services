const mongoose = require('mongoose');
const logger = require('pino')();
const app = require('./app');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Listen.
    app.listen(process.env.PORT);
    logger.info(`Ready to cut grass ${process.env.PORT}`);
  });