import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Popup from '../components/Popup';
import registerServiceWorker from '../registerServiceWorker';

ReactDOM.render(<Popup />, document.getElementById('root'));
registerServiceWorker();
