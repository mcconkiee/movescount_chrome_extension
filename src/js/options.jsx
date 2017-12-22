import React from 'react';
import ReactDOM from 'react-dom';
import Options from '../components/Options';
import registerServiceWorker from '../registerServiceWorker';

ReactDOM.render(<Options />, document.getElementById('root'));
registerServiceWorker();
