import React, { Component } from 'react';
import ApiHelper from '../js/ApiHelper';
import ChromeHelper from '../js/chrome-helpers';
import Constants from '../js/Constants';
import Tab from './Tab';
import '../styles/index.scss';
import '../styles/theme.css';
import '../styles/suunto.css';

let instance = null;
export class Options extends Component {
  constructor(props) {
    super(props);
    instance = this;
    const useMetric = localStorage.getItem(Constants.storageKeys.USE_METRIC);
    this.state = {
      activeTab: null,
      error: null,
      cookie: null,
      useMetric,
    };
  }
  componentWillMount() {
    ChromeHelper.cookie().then((cookie) => {
      console.log(cookie);

      instance.setState({ cookie });
    });
    this.handleInputChange = this.handleInputChange.bind(this);
    const self = this;
    setTimeout(() => {
      if (self.state.activeTab === null) {
        self.setState({ activeTab: self.settingsTab });
      }
    }, 300);
  }

  settingsSection() {
    return (
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
    );
  }
  downloadSection() {
    return (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            const options = {
              sendTo: 'eric@ericmcconkie.com',
              format: 'gpx',
            };
            ApiHelper.downloadMoves(this.state.cookie.forRequest, options)
              .then((response) => {
                this.setState({ download: response });
              })
              .catch((e) => {
                this.setState({ error: e });
              });
          }}
        >
          Download all my Moves
        </button>
        &nbsp;
        <button
          className="btn btn-primary"
          onClick={() => {
            const options = {
              sendTo: 'eric@ericmcconkie.com',
              format: 'gpx',
            };
            ApiHelper.downloadRoutes(this.state.cookie.forRequest, options)
              .then((response) => {
                this.setState({ download: response });
              })
              .catch((e) => {
                this.setState({ error: e });
              });
          }}
        >
          Download all my routes
        </button>
      </div>
    );
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
    console.log(this.state);

    return (
      <div className="container">
        <div>
          <div>
            <ul className="nav nav-tabs" role="tablist">
              <Tab
                ref={(tab) => {
                  this.settingsTab = tab;
                }}
                onClick={(e) => {
                  this.setState({ activeTab: this.settingsTab });
                }}
                title="Settings"
                active={this.state.activeTab}
              />
              <Tab
                ref={(tab) => {
                  this.donwloadTab = tab;
                }}
                onClick={(e) => {
                  this.setState({ activeTab: this.donwloadTab });
                }}
                title="Download"
                active={this.state.activeTab}
              />

              <Tab
                ref={(tab) => {
                  this.debugTab = tab;
                }}
                onClick={(e) => {
                  this.setState({ activeTab: this.debugTab });
                }}
                title="Debug"
                active={this.state.activeTab}
              />
            </ul>

            <div className="tab-content">
              <div
                role="tabpanel"
                className={`tab-pane ${
                  this.state.activeTab === this.settingsTab ? 'active' : null
                }`}
                id="settings"
              >
                {this.settingsSection()}
              </div>
              <div
                role="tabpanel"
                className={`tab-pane ${
                  this.state.activeTab === this.donwloadTab ? 'active' : null
                }`}
                id="download"
              >
                {this.downloadSection()}
              </div>
              <div
                role="tabpanel"
                className={`tab-pane ${this.state.activeTab === this.debugTab ? 'active' : null}`}
                id="debug"
              >
                <pre>
                  {this.state.cookie ? JSON.stringify(this.state.cookie) : 'no cookie found'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Options;
