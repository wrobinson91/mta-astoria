import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SubwayContainer from '../containers/SubwayContainer.jsx';
import { SubwayContextProvider } from '../context/SubwayContext.jsx';

// const [trainData, setNewTrainData] = useState([10, 35]);


const App = () => (
  <>
    <SubwayContextProvider>
      <h2>This Is My Project</h2>
      <SubwayContainer />
    </SubwayContextProvider>
  </>
);

export default App;
