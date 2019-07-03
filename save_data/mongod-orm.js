const mongoose = require('mongoose');

// const { Schema } = mongoose;
const { MongoClient } = require('mongodb');

const db = mongoose.connection;

mongoose.connect('mongodb://localhost/solo-project', { useNewUrlParser: true }, () => {
  console.log('Connect callback');
  // console.log('our DB object.collection: ', connectDb.collections);
});

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', () => {
  console.log('Connected with MogoDB ORM - MTA solo project');
});

module.exports = function (data) {
  console.log(data);
};
