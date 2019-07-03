import React, { useState, useEffect, useContext } from 'react';
import TrainTime from '../components/TrainTime.jsx';
import SubwayContext from '../context/SubwayContext.jsx';
import * as types from '../constants/actionTypes.js';


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

  const subwayContextTest = useContext(SubwayContext);
  console.log(subwayContextTest);

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

  useEffect(() => {
    console.log('state change: ', subwayContextTest.state);
  }, [subwayContextTest.state]);

  // render first three
  return (
    <>
      <h4>Your Next Subway Times</h4>
      <div>
        <button type="submit" onClick={fetchTrainData}>Refresh Sked</button>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            subwayContextTest.dispatch({ type: types.LOGIN_REQ, loggedIn: true });
            console.log('hello, dispatch called');
          }}
        >
Login Dummy

        </button>
      </div>
      <TrainTime trainTimes={trainTimes} />
    </>
  );
};
export default SubwayContainer;
