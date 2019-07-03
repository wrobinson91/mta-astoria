const request = require('request');
// add in MTA API
const MTA_API_URL = 'http://datamine.mta.info/mta_esi.php?key=cd2dda73f82857cc82ab60fe95735909&feed_id=16';

const migrate = require('./mongod-orm');

request(MTA_API_URL, (err, resp) => {
  console.log('called request, in capture.js');
  const data = JSON.parse(resp.body);
  migrate(data);
});
