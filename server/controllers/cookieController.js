const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const ourSecret = 'hC_I4ITOEgNtLI0BOV4IepztMqt0e51fMmAQrwULblGmJ2rnhbqbhugDc9Bxh8wcsIz60XQWBBb13mz22BcoBuXjeL';
const cookieController = {};

cookieController.setCookie = (req, res, next) => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  res.cookie('tracking-you', randomNumber, { expires: new Date(Date.now() + 900000), httpOnly: true });
  return next();
};

cookieController.setSSIDCookie = (req, res, next) => {
  const { username } = req.body;

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      console.log('error in accessing DB for username');
      throw new Error(err);
    }
    // ! CHECKED FOR NOT NULL
    if (foundUser !== null) {
      const userId = foundUser._id;

      // TODO: refactor
      const payload = {
        userId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
      };
      jwt.sign(payload, ourSecret, { algorithm: 'HS256' }, (jwtErr, token) => {
        if (err) throw new Error(jwtErr);
        console.log('token inside callback: ', token);
        res.cookie('ssid', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.locals.userId = userId;
        return next();
      });
    }
  });
};

module.exports = cookieController;
