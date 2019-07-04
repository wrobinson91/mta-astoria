import React, { useContext, useState, useEffect } from 'react';
import SubwayContext from '../context/SubwayContext.jsx';
import * as types from '../constants/actionTypes.js';
import subwayStops from '../constants/subwayStops';

const Signup = () => {
  const userContext = useContext(SubwayContext);

  const stopOptions = [<option key="option0" value="EMPTY">-</option>];
  subwayStops.map((stop, idx) => {
    stopOptions.push(<option key={`option${idx + 1}`} value={stop.stopId}>{stop.stopName}</option>);
  });

  // const stopOptions = [<option value="R08S">39th Avenue</option>, <option value="R23S,Q01S">Canal Street</option>, <option value={['TKTK']}>FAKE</option>];

  const [usernameInputSignup, setUsernameInputSignup] = useState('');
  const [passwordInputSignup, setPasswordInputSignup] = useState('');
  const [phoneInputSignup, setPhoneInputSignup] = useState('');
  const [homeStopInputSignup, setHomeStopInputSignup] = useState('');
  const [workStopInputSignup, setWorkStopInputSignup] = useState('');
  const [minutesInputSignup, setMinutesInputSignup] = useState(1);


  const createUserReq = (username, password, phoneNumber, homeStop, workStop, timeToStation) => {
    console.log('stop info: ', homeStop, workStop);
    const newUserModel = {
      username,
      password,
      phoneNumber,
      homeStop: homeStop.split(','),
      workStop: workStop.split(','),
      timeToStation,
    };

    console.log('body to be sent: ', newUserModel);

    fetch('/signup', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(newUserModel) })
      .then(data => data.json())
      .then((obj) => {
        console.log('you have created an account and are going to log on:', obj.userInfo);
        userContext.dispatch({ type: types.LOGIN_REQ, userInfo: obj.userInfo, newTrainTimes: obj.newTrainTimes });
      // userContext.dispatch({ type: types.GET_NEW_DATA, newTrainTimes: obj.myNextTrain });
      });
  };

  useEffect(() => {
    console.log('things are changin');
  }, [usernameInputSignup, passwordInputSignup, phoneInputSignup, homeStopInputSignup, workStopInputSignup, minutesInputSignup]);

  return (
    <section>
      <h3>Make New Account</h3>
      <form id="signupForm" onSubmit={(e) => { e.preventDefault(); createUserReq(usernameInputSignup, passwordInputSignup, phoneInputSignup, homeStopInputSignup, workStopInputSignup, minutesInputSignup); }}>
        <label htmlFor="usernameSignup">
        Username:
          {' '}
          <input type="text" required name="username" id="usernameSignup" placeholder="Username" value={usernameInputSignup} onChange={(e) => { e.preventDefault(); setUsernameInputSignup(e.target.value); }} />
        </label>

        <label htmlFor="passwordSignup">
        Password:
          {' '}
          <input type="password" required name="password" id="passwordSignup" placeholder="Password" value={passwordInputSignup} onChange={(e) => { e.preventDefault(); setPasswordInputSignup(e.target.value); }} />
        </label>

        <label htmlFor="phoneNumberSignup">
        Phone Number (optional):
          {' '}
          <input type="tel" name="phoneNumber" id="phoneNumberSignup" placeholder="#" pattern="[0-9]{10}" min="10" max="10" value={phoneInputSignup} onChange={(e) => { e.preventDefault(); setPhoneInputSignup(e.target.value); }} />
        </label>

        <label htmlFor="homeStopSignup">
        Home Stop:
          {' '}
          <select multiple={false} name="homeStop" id="homeStopSignup" value={homeStopInputSignup} onChange={(e) => { e.preventDefault(); setHomeStopInputSignup(e.target.value); }}>
            {stopOptions}
          </select>
        </label>

        <label htmlFor="workStopSignup">
        Work Stop:
          {' '}
          <select multiple={false} name="workStop" id="workStopSignup" valie={workStopInputSignup} onChange={(e) => { e.preventDefault(); setWorkStopInputSignup(e.target.value); }}>
            {stopOptions}
          </select>
        </label>

        <label htmlFor="timeToStationSignup">
        Minutes From Your Stop:
          {' '}
          <input type="number" name="timeToStation" id="timeToStationSignup" placeholder="# minutes" min="1" max="30" value={minutesInputSignup} onChange={(e) => { e.preventDefault(); setMinutesInputSignup(e.target.value); }} />
        </label>

        <input type="submit" value="Sign Up" />
      </form>
    </section>
  );
};

export default Signup;
