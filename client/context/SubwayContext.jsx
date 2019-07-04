import * as React from 'react';
import * as types from '../constants/actionTypes.js';


const SubwayContext = React.createContext();

const initState = {
  newTrainTimes: [{
    trainLine: 'Loading...',
    arrivalTime: 'Loading...',
    departTime: 'Loading...',
  }],
  userInfo: {
    homeStop: 'R08S',
    workStop: ['R23S', 'Q01S'],
    timeToStation: 5,
    loggedIn: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.CREATE_ACCOUNT:
      console.log('made new account and logged in');
      return { ...state, userInfo: action.userInfo };
    case types.REAL_LOGIN_REQ:
      console.log("let's actually login");
      return { ...state };
    case types.LOGIN_REQ:
      console.log('\n\n\nyou are logged in: ', action.loggedIn);
      // reassign user info
      return { ...state, userInfo: action.userInfo };
    case types.GET_NEW_DATA:
      console.log('so you want a refresh?');
      return { ...state, newTrainTimes: action.trainTimes };
    default:
      return state;
  }
};

const SubwayContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initState);
  const value = { state, dispatch };

  return (
    <SubwayContext.Provider value={value}>{props.children}</SubwayContext.Provider>
  );
};

const SubwayContextConsumer = SubwayContext.Consumer;

export { SubwayContextProvider, SubwayContextConsumer };
export default SubwayContext;
