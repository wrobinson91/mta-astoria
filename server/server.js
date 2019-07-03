const express = require('express');
// const Server = require('socket.io');
// * maybe no sockets required.
// * look up https://developer.mozilla.org/en-US/docs/Web/API/EventSource
// * https://www.html5rocks.com/en/tutorials/eventsource/basics/
// const io = new Server();
// const request = require('request');
// const fs = require('fs');
const app = express();
const path = require('path');

const port = 3000;

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}../../index.html`);
});

app.get('*', (req, res) => {
  res.status(404).send('Path does not exist.');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
