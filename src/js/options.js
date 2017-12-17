import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Options from '../components/Options';
import registerServiceWorker from '../registerServiceWorker';

ReactDOM.render(<Options />, document.getElementById('root'));
registerServiceWorker();
