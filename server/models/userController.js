const User = require('./userModel');

const userController = {};

// add lots of things
userController.createUser = (req, res, next) => {
  const {
    username,
    password,
    phoneNumber,
    homeStop,
    workStop,
    timeToStation,
  } = req.body;
  // console.log(req.body);

  User.create({
    username,
    password,
    phoneNumber,
    homeStop,
    workStop,
    timeToStation,
  }, (err, newUser) => {
    if (err) {
      console.log('error adding new user to DB');
      throw new Error(err);
    }
    console.log('added to DB');
    // res.status.json(newUser);
    res.locals.userInfo = {
      username: newUser.username,
      phoneNumber: newUser.phoneNumber,
      homeStop: newUser.homeStop,
      workStop: newUser.workStop,
      timeToStation: newUser.timeToStation,
      loggedIn: true,
    };
    return next();
  });
};

userController.verifyUser = (req, res, next) => {
  console.log('made it to the server');
  const { username, password: givenPassword } = req.body;
  console.log(JSON.stringify(req.body));

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      console.log('error in accessing DB');
      throw new Error(err);
    }
    // ! look for PW
    if (foundUser !== null) {
      if (foundUser.password === givenPassword) {
        console.log('succesful login');
        res.locals.userInfo = {
          username: foundUser.username,
          phoneNumber: foundUser.phoneNumber,
          homeStop: foundUser.homeStop,
          workStop: foundUser.workStop,
          timeToStation: foundUser.timeToStation,
          loggedIn: true,
        };
        return next();
      }
      console.log('pw no match');
      return res.status(200).send('Invalid login credentials.');
      // return res.redirect('/signup');
    }
    console.log('no user found');
    return res.status(200).redirect('/');

    // return res.redirect('/signup');
  });
};

userController.verifyUserParam = (req, res, next) => {
  console.log('made it to the server');
  const { username } = req.params;
  console.log(JSON.stringify(req.params));

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      console.log('error in accessing DB');
      throw new Error(err);
    }
    // ! look for PW
    if (foundUser !== null) {
      console.log('succesful login');
      res.locals.userInfo = {
        username: foundUser.username,
        phoneNumber: foundUser.phoneNumber,
        homeStop: foundUser.homeStop,
        workStop: foundUser.workStop,
        timeToStation: foundUser.timeToStation,
        loggedIn: true,
      };
      return next();
    }
    console.log('no user found');
    return res.status(200).redirect('/');
    // return res.redirect('/signup');
  });

  // return res.redirect('/signup');
};

userController.updateStops = (req, res, next) => {
  // fill out here
};


module.exports = userController;
