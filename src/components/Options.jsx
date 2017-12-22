import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import React, { Component } from 'react';
import ChromeHelper from '../js/chrome-helpers';
import Constants from '../js/Constants';
import '../styles/index.css';
import '../styles/theme.css';
import '../styles/suunto.css';

let instance = null;
export class Options extends Component {
  constructor(props) {
    super(props);
    instance = this;
    const useMetric = localStorage.getItem(Constants.storageKeys.USE_METRIC);
    this.state = { cookie: null, useMetric };
  }
  componentWillMount() {
    ChromeHelper.cookie().then((cookie) => {
      instance.setState({ cookie });
    });
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    localStorage.setItem(Constants.storageKeys.USE_METRIC, value);
    this.setState({
      [name]: value,
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
          <div>
            <h1>Settings</h1>
            <div>
              <h3>Units</h3>
              <div>
                <label htmlFor="useMetric">
                  <input
                    defaultChecked={this.state.useMetric === 'true'}
                    name="useMetric"
                    type="checkbox"
                    id="useMetric"
                    onChange={this.handleInputChange}
                  />
                  Use metric (e.g. kms)
                </label>
              </div>
            </div>
          </div>
          <pre>{this.state.cookie ? JSON.stringify(this.state.cookie) : 'no cookie found'}</pre>
        </div>
      </div>
    );
  }
}

export default Options;
