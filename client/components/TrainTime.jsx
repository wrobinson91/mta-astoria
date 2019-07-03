import React from 'react';

//* needs props here
const TrainTime = props => (
  <>
    <p>{`Train Line: ${props.trainTimes[0].trainLine}`}</p>
    <p>{`Minutes until departure at your station: ${props.trainTimes[0].departTime}`}</p>
    <p>{`Arrival at work: ${props.trainTimes[0].arrivalTime}`}</p>
  </>
);
export default TrainTime;
