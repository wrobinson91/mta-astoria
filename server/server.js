const express = require('express');
// const request = require('request');
// const fs = require('fs');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('Hello, welcome to my server.');
});

app.get('*', (req, res) => {
  res.status(404).send('Path does not exist.');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
