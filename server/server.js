const express = require('express');
// * probably no sockets required.
// * look up https://developer.mozilla.org/en-US/docs/Web/API/EventSource
// * https://www.html5rocks.com/en/tutorials/eventsource/basics/

const app = express();
const dataController = require('./controllers/dataController.js');
// const path = require('path');

const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('welcome to the server');
});

app.get('/api', dataController.getMyTrainData, (req, res) => {
  // do something with this bigass json
  // console.log('my data:', res.locals.myNextTrain);

  res.status(200).json(res.locals.myNextTrain);
  // res.status(200).send(JSON.stringify(res.locals.myNextTrain));
});

app.get('*', (req, res) => {
  res.status(404).send('Path does not exist.');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
