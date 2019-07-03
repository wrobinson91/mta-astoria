import React, { useState, useEffect } from 'react';
import getMyTrainData from '../utils/fetching.js';
import TrainTime from '../components/TrainTime.jsx';

// const mtaReq = {
//   method: 'GET',
//   url: 'http://datamine.mta.info/mta_esi.php?key=cd2dda73f82857cc82ab60fe95735909&feed_id=16',
//   encoding: null,
// };

// const mtaRequest = require('../../server/index.js');

// probably needs state


const SubwayContainer = () => {
  const [trainTimes, setNewTrainTimes] = useState([
    {
      trainLine: 'Loading...',
      arrivalTime: 'Loading...',
      departTime: 'Loading...',
    },
  ]);

  const fetchTrainData = () => {
    fetch('/api')
      .then(data => data.json())
      .then((cleanedTrainData) => {
        console.log('cleaned out data: ', cleanedTrainData);
        setNewTrainTimes(cleanedTrainData);
      });
  };

  useEffect(() => {
    fetchTrainData();
  }, []);

  return (
    <>
      <h4>Your Next Subway Times</h4>
      <div>
        <button type="submit" onClick={fetchTrainData}>Refresh Sked</button>
      </div>
      <TrainTime trainTimes={trainTimes} />
    </>
  );
};
export default SubwayContainer;
