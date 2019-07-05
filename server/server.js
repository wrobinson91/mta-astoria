const express = require('express');
const path = require('path');
// * probably no sockets required.
// * look up https://developer.mozilla.org/en-US/docs/Web/API/EventSource
// * https://www.html5rocks.com/en/tutorials/eventsource/basics/

const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const dataController = require('./controllers/dataController.js');
const userController = require('./models/userController');
const cookieController = require('./controllers/cookieController');
// const sessionController = require('./controllers/sessionController');

// const path = require('path');

const mongoURI = 'mongodb://localhost/solo-project-mta';
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log('Connect callback');
  // console.log('our DB object.collection: ', connectDb.collections);
});
// mongoose.connect(mongoURI);

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/static', express.static(path.join(__dirname, '../build')));
// app.use('/', express.static('html'));

// TODO: set normal cookie
app.get('/', cookieController.setCookie, cookieController.isLoggedIn, dataController.getMyTrainData, (req, res) => {
  console.log('at the home route');
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

// add a cookie to verify which user to pull data from on this req
app.get('/api', dataController.getMyTrainData, (req, res) => {
  // do something with this bigass json
  // console.log('my data:', res.locals.myNextTrain);

  console.log('sending back data');
  res.status(200).json(res.locals.myNextTrain);
  // res.status(200).send(JSON.stringify(res.locals.myNextTrain));
});

app.get('/api/:username', userController.verifyUserParam, dataController.getMyTrainData, (req, res) => {
  // do something with this bigass json
  // console.log('my data:', res.locals.myNextTrain);

  console.log('sending back data');
  res.status(200).json(res.locals.myNextTrain);
  // res.status(200).send(JSON.stringify(res.locals.myNextTrain));
});


// TODO: set SSID cookie/jwt
app.post('/signup', userController.createUser, cookieController.setSSIDCookie, dataController.getMyTrainData, (req, res) => {
  // console.log('my res locals: ', res.locals);
  const { userInfo, myNextTrain: newTrainTimes } = res.locals;
  console.log('logged in undefined?', res.locals.userInfo.loggedIn);
  console.log('my data sent out: ', userInfo, newTrainTimes);
  res.status(200).send({ userInfo, newTrainTimes });
});

// TODO: set SSID cookie/jwt
app.post('/login', userController.verifyUser, cookieController.setSSIDCookie, dataController.getMyTrainData, (req, res) => {
  // redirect to mainpage
  console.log('sending shit back');
  console.log('logged in undefined?', res.locals.userInfo.loggedIn);
  const { userInfo, myNextTrain: newTrainTimes } = res.locals;
  res.set('Content-Type', 'application/json');
  res.status(200).json({ userInfo, newTrainTimes });
});

app.post('/auth/login', cookieController.isLoggedIn, dataController.getMyTrainData, (req, res) => {
  console.log('jwt confirmed, already logged in');
  const { userInfo, myNextTrain: newTrainTimes } = res.locals;
  res.set('Content-Type', 'application/json');
  res.status(200).json({ userInfo, newTrainTimes });
});

app.get('*', (req, res) => {
  res.status(404).send('Path does not exist.');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
