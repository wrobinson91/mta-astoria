const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MongoClient = require('mongodb').MongoClient;

const connectDb = mongoose.connection;

mongoose.connect('mongodb://localhost/solo-project', () => {
  console.log('Connect callback');
  // console.log('our DB object.collection: ', connectDb.collections);
});

mongoose.connection.once('open', () => {
  console.log('Connected with MogoDB ORM - MTA solo project');
});

module.exports = function (data) {
  console.log(data);
};
