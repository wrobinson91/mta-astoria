const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/userModel');

const ourSecret = 'hC_I4ITOEgNtLI0BOV4IepztMqt0e51fMmAQrwULblGmJ2rnhbqbhugDc9Bxh8wcsIz60XQWBBb13mz22BcoBuXjeL';
const cookieController = {};

cookieController.setCookie = (req, res, next) => {
  console.log('setting a cookie');
  const randomNumber = Math.floor(Math.random() * 1000000);
  res.cookie('tracking-you', randomNumber, { expires: new Date(Date.now() + 900000), httpOnly: true });
  return next();
};

cookieController.setSSIDCookie = (req, res, next) => {
  const { username } = req.body;
  console.log('made a jwt');

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

cookieController.isLoggedIn = (req, res, next) => {
  // console.log('this is in session controller is logged in', req.cookies);
  console.log('checking the jwt');
  const { ssid } = req.cookies;

  if (!ssid) {
    return res.status(200).sendFile(path.resolve(__dirname, '../../index.html'));

    //  return next();
  }
  jwt.verify(ssid, ourSecret, (err, decoded) => {
    if (err) throw new Error(err);
    //* if finding a JWT was successful, then I went to get the user information, and immediately fetch data
    //* invoke FIND
    //* store user info in res.locals.userInfo
    //* res.redirect(/api/
    console.log('decoded token: ', decoded);
    User.findById(decoded.userId, (err, foundUser) => {
      if (err) {
        console.log('error in finding user by id, in SSID verification');
        throw new Error(err);
      }
      if (foundUser !== null) {
        console.log('found user, who is already logged on: ', foundUser);
        res.locals.userInfo = {
          username: foundUser.username,
          phoneNumber: foundUser.phoneNumber,
          homeStop: foundUser.homeStop,
          workStop: foundUser.workStop,
          timeToStation: foundUser.timeToStation,
          loggedIn: true,
        };
        console.log('passed on res locals: ', res.locals.userInfo);
        return next();
      }
      return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
    });
  });
};

module.exports = cookieController;
