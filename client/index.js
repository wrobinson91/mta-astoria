import React from 'react';
import { render } from 'react-dom';
// needs to have JSX
import { AppContainer } from 'react-hot-loader';
import { SubwayContextProvider } from './context/SubwayContext.jsx';
import App from './components/App.jsx';
import styles from './styles/styles.css';
import 'babel-polyfill';

// set init state here

render(
  <AppContainer>
    <SubwayContextProvider>
      <App />
    </SubwayContextProvider>

  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App.jsx', () => {
    const NextApp = require('./components/App.jsx').default;
    render(
      <AppContainer>
        <SubwayContextProvider>

          <NextApp />
        </SubwayContextProvider>

      </AppContainer>,
    );
  });
}
