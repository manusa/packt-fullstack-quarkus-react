import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {store} from './store';
import theme from './styles/theme';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
