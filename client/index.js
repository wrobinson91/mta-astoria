import React from 'react';
import { render } from 'react-dom';
// needs to have JSX
import { AppContainer } from 'react-hot-loader';
import App from './components/App.jsx';
// import styles from './styles/styles.css';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App.jsx', () => {
    const NextApp = require('./components/App.jsx').default;
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
    );
  });
}
