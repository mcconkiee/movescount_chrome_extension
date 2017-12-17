import ChromeHelper from '../js/chrome-helpers';
import React, { Component, PropTypes } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/index.css';
import '../styles/theme.css';
let instance = null;
export class Options extends Component {
  constructor(props) {
    super(props);
    instance = this;
    this.state = { cooke: null };
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
