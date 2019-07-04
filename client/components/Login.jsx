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
      .then((userInfo) => {
        console.log('you have logged in: ', userInfo);
        userContext.dispatch({ type: types.LOGIN_REQ, userInfo });
      })
      .catch((err) => {
        console.log('error in login req');
        throw new Error(err);
      });
  };

  return (
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
      <>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            // loggedIn = true;
            userContext.dispatch({ type: types.LOGIN_REQ, userInfo: { loggedIn: true } });
            console.log('hello, dispatch called');
          }}
        >

Login Dummy

        </button>
      </>

      <Signup />
    </section>
  );
};

export default Login;
