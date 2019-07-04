const express = require('express');
// * probably no sockets required.
// * look up https://developer.mozilla.org/en-US/docs/Web/API/EventSource
// * https://www.html5rocks.com/en/tutorials/eventsource/basics/

const app = express();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const dataController = require('./controllers/dataController.js');
const userController = require('./models/userController');

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('welcome to the server');
});

app.get('/api', dataController.getMyTrainData, (req, res) => {
  // do something with this bigass json
  // console.log('my data:', res.locals.myNextTrain);

  console.log('sending back data');
  res.status(200).json(res.locals.myNextTrain);
  // res.status(200).send(JSON.stringify(res.locals.myNextTrain));
});

app.post('/signup', userController.createUser, (req, res) => {
  res.status(200).send('You have created a new user.');
});

app.post('/login', userController.verifyUser, (req, res) => {
  // redirect to mainpage
  console.log('sending shit back');
  console.log(res.locals.userInfo);
  res.set('Content-Type', 'application/json');
  res.status(200).json(res.locals.userInfo);
});

app.get('*', (req, res) => {
  res.status(404).send('Path does not exist.');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
