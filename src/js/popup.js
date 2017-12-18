import React from 'react';
import ReactDOM from 'react-dom';
import Popup from '../components/Popup';
import registerServiceWorker from '../registerServiceWorker';

ReactDOM.render(<Popup />, document.getElementById('root'));
registerServiceWorker();
