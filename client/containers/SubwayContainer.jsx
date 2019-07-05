/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useContext } from 'react';
import TrainTime from '../components/TrainTime.jsx';
import SubwayContext from '../context/SubwayContext.jsx';
import * as types from '../constants/actionTypes.js';


const SubwayContainer = (props) => {
  const subwayContext = useContext(SubwayContext);
  console.log(subwayContext);
  const { stopOptions } = props;
  let userInfoTest;

  const fetchLoginData = () => {
    fetch('/login', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify({ username: 'wrobinson', password: 'hi' }) })
      .then(data => data.json())
      .then((userInfo) => {
        console.log('you have logged in: ', userInfo);
        userInfoTest = userInfo;
        subwayContext.dispatch({ type: types.LOGIN_REQ, userInfo: userInfoTest });
      })
      .catch((err) => {
        console.log('error in login req');
        throw new Error(err);
      });
  };

  const fetchTrainData = () => {
    fetch(`/api/${subwayContext.state.userInfo.username}`)
      .then(data => data.json())
      .then((cleanedTrainData) => {
        console.log('cleaned out data: ', cleanedTrainData);
        // setNewTrainTimes(cleanedTrainData);
        subwayContext.dispatch({ type: types.GET_NEW_DATA, newTrainTimes: cleanedTrainData });
      });
  };

  // useEffect(() => {
  //   fetchTrainData();
  // }, []);

  useEffect(() => {
    console.log('state change: ', subwayContext.state);
  }, [subwayContext.state]);

  console.log('work stops: ', subwayContext.state.userInfo.workStop);
  // render first three?
  return (
    <>
      <h4>{subwayContext.state.userInfo.username}'s Next Subway Times</h4>
      <div>
        <button type="submit" onClick={fetchTrainData}>Refresh Sked</button>
      </div>
      <section>
        <h5>Change Stops</h5>
        <div>Add In Form</div>
        {/* copy in form from Signup.jsx */}
      </section>
      <TrainTime homeStop={subwayContext.state.userInfo.homeStop !== undefined ? subwayContext.state.userInfo.homeStop.toString() : ''} workStop={subwayContext.state.userInfo.workStop !== undefined ? subwayContext.state.userInfo.workStop.toString() : ''} trainTimes={subwayContext.state.newTrainTimes} />
    </>
  );
};
export default SubwayContainer;
