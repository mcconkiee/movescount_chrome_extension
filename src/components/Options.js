import ChromeHelper from '../js/chrome-helpers';
import React, { Component, PropTypes } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/index.css';
import '../styles/theme.css';
import '../styles/suunto.css';

let instance = null;

const UNITS = {
  IMPERIAL: 'imperial',
  METRIC: 'metric'
};

export class Options extends Component {
  constructor(props) {
    super(props);
    instance = this;
    this.state = { cooke: null, units: UNITS.IMPERIAL };
  }
  componentWillMount() {
    ChromeHelper.cookie().then(cookie => {
      // instance.setState({ cookie: cookie });
      console.log(cookie, instance);
      instance.setState({ cookie: cookie });
    });
  }

  render() {
    return (
      <div className="container">
        <div>
          <header>
            <div>
              <h1>Cookie Info</h1>
            </div>
          </header>
          <div>
            <i className="icon-4" />
          </div>
          <pre>
            {this.state.cookie
              ? JSON.stringify(this.state.cookie)
              : 'no cookie found'}
          </pre>
        </div>
      </div>
    );
  }
}

export default Options;
