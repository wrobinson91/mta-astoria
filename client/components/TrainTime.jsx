import React from 'react';

//* needs props here
const TrainTime = (props) => {
  const { trainLine, departTime, arrivalTime } = props.trainTimes[0];
  return (
    <>
      <p>{`Train Line: ${trainLine}`}</p>
      <p>{`Minutes until departure at your station: ${departTime}`}</p>
      <p>{`Arrival at work: ${arrivalTime}`}</p>
    </>
  );
};
export default TrainTime;
