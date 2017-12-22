import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import React from 'react';
import reducers from '../redux/reducers';

import Popup from '../components/Popup';
import registerServiceWorker from '../registerServiceWorker';

const store = createStore(reducers);
ReactDOM.render(
  <Provider store={store}>
    <Popup />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
