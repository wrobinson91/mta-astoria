import React from 'react';
import { subwayStopsKey } from '../constants/subwayStops';

const TrainTime = (props) => {
  const { trainLine, departTime, arrivalTime } = props.trainTimes[0];
  const { homeStop, workStop } = props;
  const minCheck = departTime > 1 ? 'minutes' : 'minute';
  // console.log(homeStop, workStop);
  return (
    <>
      <p>{`Train Line: ${trainLine}`}</p>
      <p>{`The soonest departure from ${subwayStopsKey[homeStop]} is in ${departTime} ${minCheck}.`}</p>
      <p>{`If you catch the first train, you'll make it to ${subwayStopsKey[workStop]} in ${arrivalTime} minutes.`}</p>
    </>
  );
};

export default TrainTime;
