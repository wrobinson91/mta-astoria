import React, { useContext, useState } from 'react';
import SubwayContext from '../context/SubwayContext.jsx';
import Signup from './Signup.jsx';
import * as types from '../constants/actionTypes.js';

const Login = () => {
  const userContext = useContext(SubwayContext);
  const { loggedIn } = userContext.state.userInfo;

  const [usernameInputLogin, setUsernameInputLogin] = useState('');
  const [passwordInputLogin, setPasswordInputLogin] = useState('');

  const realLoginFetch = (userSubmit, pwSubmit) => {
    // console.log(event);
    fetch('/login', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify({ username: userSubmit, password: pwSubmit }) })
      .then(data => data.json())
      .then((userObj) => {
        console.log('you have logged in: ', userObj);
        userContext.dispatch({ type: types.LOGIN_REQ, userInfo: userObj.userInfo, newTrainTimes: userObj.newTrainTimes });
      })
      .catch((err) => {
        console.log('error in login req');
        alert('Invalid login. Please try again.');
        // throw new Error(err);
      });
  };

  const alreadyLoggedInFetch = () => {
    fetch('/auth/login', { method: 'POST' })
      .then(data => data.json())
      .then((userObj) => {
        console.log('you have confirmed your login.');
        userContext.dispatch({ type: types.LOGIN_REQ, userInfo: userObj.userInfo, newTrainTimes: userObj.newTrainTimes });
      })
      .catch((err) => {
        console.log('error in already logged in req');
        alert('You are not already logged in. Please sign in.');
      });
  };

  return (
    <>

      <section>
        <h3>Log In</h3>
        <form id="loginForm" onSubmit={(e) => { e.preventDefault(); realLoginFetch(usernameInputLogin, passwordInputLogin); }}>
          <label htmlFor="usernameLogin">
            Username:
            {' '}
            <input type="text" name="username" id="usernameLogin" placeholder="Username" value={usernameInputLogin} onChange={(e) => { e.preventDefault(); setUsernameInputLogin(e.target.value); }} />
          </label>

          <label htmlFor="passwordLogin">
            Password:
            {' '}
            <input type="password" name="password" id="passwordLogin" placeholder="Password" value={passwordInputLogin} onChange={(e) => { e.preventDefault(); setPasswordInputLogin(e.target.value); }} />
          </label>
          <input type="submit" value="Log In" />
        </form>
        <aside>
          <button type="submit" onClick={(e) => { e.preventDefault(); alreadyLoggedInFetch(); }}>Already Logged In?</button>
        </aside>
      </section>
      <Signup />

    </>
  );
};

export default Login;
