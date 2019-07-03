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
    return next();
  });
};

userController.verifyUser = (req, res, next) => {
  const { username, password: givenPassword } = req.body;

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      console.log('error in accessing DB');
      throw new Error(err);
    }
    // ! look for PW
    if (foundUser !== null) {
      if (foundUser.password === givenPassword) {
        console.log('succesful login');
        return next();
      }
    }
  });
};


module.exports = userController;
