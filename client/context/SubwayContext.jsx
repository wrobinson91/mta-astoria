import * as React from 'react';
import * as types from '../constants/actionTypes.js';


const SubwayContext = React.createContext();

const initState = {
  newTrainTimes: [],
  userInfo: { loggedIn: false },
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.LOGIN_REQ:
      console.log('\n\n\nyou are logged in: ', action.loggedIn);
      // reassign user info
      return { ...state, userInfo: { loggedIn: action.loggedIn } };
    case types.GET_NEW_DATA:
      console.log('so you want a refresh?');
      return { ...state };
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
