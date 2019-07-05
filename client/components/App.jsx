import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SubwayContainer from '../containers/SubwayContainer.jsx';
import SubwayContext from '../context/SubwayContext.jsx';
import subwayStops from '../constants/subwayStops.js';
import * as types from '../constants/actionTypes.js';
import Login from './Login.jsx';

const App = () => {
  const userContext = useContext(SubwayContext);
  const { loggedIn } = userContext.state.userInfo;

  const stopOptions = [<option key="option0" value="EMPTY">-</option>];
  subwayStops.map((stop, idx) => {
    stopOptions.push(<option idx={idx} key={`option${idx + 1}`} value={Object.keys(stop)}>{Object.values(stop)}</option>);
  });

  console.log('logged on change? ', loggedIn);
  return (
    <>
      {/* <SubwayContextProvider> */}
      <h2>This Is My Project</h2>
      {
        loggedIn ? <SubwayContainer stopOptions={stopOptions} /> : <Login stopOptions={stopOptions} />
      }
    </>
  );
};

export default App;
