import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SubwayContainer from '../containers/SubwayContainer.jsx';
import SubwayContext from '../context/SubwayContext.jsx';
import * as types from '../constants/actionTypes.js';
import Login from './Login.jsx';


// import { SubwayContextProvider } from '../context/SubwayContext.jsx';

// const [trainData, setNewTrainData] = useState([10, 35]);


const App = () => {


  const userContext = useContext(SubwayContext);
  const { loggedIn } = userContext.state.userInfo;
  return (
    <>
      {/* <SubwayContextProvider> */}
      <h2>This Is My Project</h2>
      {
        loggedIn ? <SubwayContainer /> : <Login />
      }
    </>
  );
};

export default App;
