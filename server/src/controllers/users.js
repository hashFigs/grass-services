const md5 = require('md5');
const jwt = require('jsonwebtoken');
// Controllers
//const MailsController = require('./mails');

// Models
const User = require('../models/users');

// const Subscription = require('../models/subscriptions');
const Session = require('../models/sessions');

class UserController {
  /**
   * Login into MK.
   *
   * @param {object} formData Login Information
   * @returns {object} Login Result
   */
  static async login(formData) {
    const user = await User.findOne({ email: formData.email, password: md5(formData.password) });
    if (!user) throw (new Error('Invalid email/password'));
    else {
      const token = jwt.sign({ userId: user._id.toString(), expiresAt: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) }, process.env.TOKEN_SECRET);
      const session = new Session({
        token,
        expiresAt: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
        userId: user._id,
      });

      await session.save();
      return ({
        token,
        userId: user._id,
      });
    }
  }

  /**
   * Register user into MK.
   *
   * @param {object} formData User Information
   * @returns {object} Register Result
   */
  static async register(formData) {
    let user = await User.findOne(
      { email: formData.email },
    );
    if (user) throw (new Error('Invalid email '));
    else {
      const isTest = (formData.email.includes('$mk.com'));
      user = new User(formData);
      user.password = md5(user.password);
      const urlVeriToken = jwt.sign({ user: user.email.toString() }, process.env.TOKEN_SECRET);
      user.urlVeri = urlVeriToken;
      user.expiresVeri = new Date(+new Date() + 7 * 24 * 60 * 60 * 1000);
      user.balance = Number('0');

      await user.save();

      if (!isTest) {
        // Send email
        const msg = {
          personalizations: [{
            to: [{ email: `${formData.email}` }],
            dynamic_template_data: {
              subject: 'Confirm your MintKnight account',
              recipient_email: `${formData.email}`,
              account_verification_link: `${process.env.FRONT_END}/account-activation/${urlVeriToken}`,
            },
          }],
          template_id: 'd-fc44f2d7a3354098aa39c413b953a9c3',
        };
        //await MailsController.sendEmail(msg);
      }

      // Delete Password before returning.
      const obj = JSON.parse(JSON.stringify(user));
      delete obj.password;
      obj.expiresIn = new Date(+new Date() + 7 * 24 * 60 * 60 * 1000);
      // eslint-disable-next-line max-len
      obj.token = jwt.sign({ userId: user._id.toString(), expiresAt: obj.expiresIn }, process.env.TOKEN_SECRET);
      obj.userId = user._id;
      const session = new Session({
        token: obj.token,
        expiresAt: obj.expiresIn,
        userId: user._id,
      });
      await session.save();
      return (obj);
    }
  }

  /**
   * send email for password update
   *
   * @param {object} formData - User Information
   * @returns {object} User
   */
  static async sendEmailPasswordUpdate(formData) {
    const user = await User.findOne(
      { email: formData.email },
    );

    if (user === null) throw (new Error('User account not found'));
    else {
      const PasswToken = jwt.sign({ user: user.email.toString() }, process.env.TOKEN_SECRET);
      user.passwToken = PasswToken;
      user.expiresPassw = new Date(+new Date() + 7 * 24 * 60 * 60 * 1000);

      await user.save();

      // Send email
      const msg = {
        personalizations: [{
          to: [{ email: `${formData.email}` }],
          dynamic_template_data: {
            subject: 'Mntknight - Password Update',
            recipient_email: `${formData.email}`,
            update_link: `${process.env.FRONT_END}/edit-password/${PasswToken}`,
          },
        }],
        template_id: 'd-9f14b197484642f0a89088c5baa2e3b4',
      };
      //await MailsController.sendEmail(msg);

      // Delete Password before returning.
      const obj = JSON.parse(JSON.stringify(user));
      delete obj.password;
      return (obj);
    }
  }

  /**
   * Get user's information.
   *
   * @param {string} userId - User Id
   * @returns {object} User
   */
  static async getUser(userId) {
    const user = await User.findOne({ _id: userId });
    if (!user) throw (new Error('Invalid userId'));
    const obj = JSON.parse(JSON.stringify(user));
    delete obj.password;
    // Add subscription
    // let subscription = null;
    // if (!!user.subscriptionId) {
    //   subscription = await Subscription.findOne({ _id: user.subscriptionId });
    //   if (!subscription) throw (new Error('Subscription not found'));
    // }
    // obj.subscription = subscription;
    return (obj);
  }

  /**
   * It verifies an email
   *
   * @param {string} token
   * @returns {object} User
   */
  static async verifyEmail(token) {
    let user = await User.findOne({ urlVeri: token });
    if (!user) throw (new Error('Invalid link '));
    if (user.expiresVeri < Date.now()) throw (new Error('Your verification link has expired'));
    if (user.isVerified === true) {
      throw (new Error('Account already activated'));
    }
    user.isVerified = true;
    user = await user.save();

    const obj = JSON.parse(JSON.stringify(user));
    delete obj.password;
    return (obj);
  }

  /**
   * Update user Password
   *
   * @param {string} password
   * @param {string} token
   * @returns {object} User
   */
  static async updatePassword(password, token) {
    let user = await User.findOne({ passwToken: token });
    if (!user) throw (new Error('Invalid Action'));
    if (user.expiresPassw < Date.now) throw (new Error('Token Expired'));

    user.password = md5(password);
    user.passwToken = '';
    user = await user.save();

    const ret = {
      status: 'success',
      message: 'password updated succesfully, please log in',
      user,
    };

    const obj = JSON.parse(JSON.stringify(ret));
    delete obj.password;

    return (obj);
  }

  /**
   * Get available networks by user
   *
   * @param {string} userId - User Id
   * @returns {array} networks (array of objects)
   */
  static async getNetworks(userId) {
    let networks = [];
    const use = await User.findOne({ _id: userId });
    if (!use) throw (new Error('Invalid userId'));

    const mumbai = { code: 'mumbai', name: 'Mumbai (testnet)' };
    const polygon = { code: 'polygon', name: 'Polygon' };
    const etherum = { code: 'etherum', name: 'Etherum' };

    switch (use.membership) {
      case 'free':
        networks = [mumbai, polygon, etherum];
        break;
      case 'basic':
        networks = [mumbai, polygon, etherum];
        break;
      case 'pro':
        networks = [mumbai, polygon, etherum];
        break;
      default:
        networks = [mumbai];
    }
    return (networks);
  }
}

module.exports = UserController;
