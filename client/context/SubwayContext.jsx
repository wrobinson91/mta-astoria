import * as React from 'react';

const SubwayContext = React.createContext();

const initState = {
  newTrainTimes: [],
  userInfo: {},
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case 'login':
      console.log('you are logged in');
      return { ...state };
    default:
      return state;
  }
};

function SubwayContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initState);
  const value = { state, dispatch };

  return (
    <SubwayContext.Provider value={value}>{props.children}</SubwayContext.Provider>
  );
}

const SubwayContextConsumer = SubwayContext.Consumer;

export { SubwayContext, SubwayContextProvider, SubwayContextConsumer };
