import React, { Component } from 'react';
import ApiHelper from '../js/ApiHelper';
import { DateRange } from 'react-date-range';
import ChromeHelper from '../js/chrome-helpers';
import Constants from '../js/Constants';
import Tab from './Tab';
import '../styles/index.scss';
import '../styles/options.scss';
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
      download: null,
      loading: false,
      cookie: null,
      movesDownloadFormat: 'gpx',
      movesDownloadDateRange: null,
      movesDownloadEmail: null,
      hideDateRange: true,
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
  newRequestState() {
    this.setState({ loading: true, download: null });
  }
  downloadMyMoves() {
    if (this.state.loading) {
      return;
    }
    const options = {
      sendTo: this.state.movesDownloadEmail,
      format: this.state.movesDownloadFormat,
      dates: this.state.movesDownloadDateRange,
    };
    this.newRequestState();
    ApiHelper.downloadMoves(this.state.cookie.forRequest, options)
      .then((response) => {
        this.setState({ download: response.toString(), loading: false });
      })
      .catch((e) => {
        this.setState({ error: e, loading: false });
      });
  }
  downloadSection() {
    return (
      <div>
        <button
          className={`btn btn-primary ${this.state.loading ? 'disabled' : null}`}
          data-toggle="modal"
          data-target="#downloadMovesModal"
        >
          Download Moves
        </button>
        &nbsp;
        <button
          className={`btn btn-primary ${this.state.loading ? 'disabled' : null}`}
          onClick={() => {
            if (this.state.loading) {
              return;
            }
            const options = {
              sendTo: 'eric@ericmcconkie.com',
              format: 'gpx',
            };
            this.newRequestState();
            ApiHelper.downloadRoutes(this.state.cookie.forRequest, options)
              .then((response) => {
                this.setState({ download: response.toString(), loading: false });
              })
              .catch((e) => {
                this.setState({ error: e, loading: false });
              });
          }}
        >
          Download routes
        </button>
      </div>
    );
  }
  uploadSection() {
    const self = this;
    return (
      <div className="form-group">
        <label htmlFor="zip">File</label>
        <input
          ref={(fileUpload) => {
            this.fileUpload = fileUpload;
          }}
          name="zip"
          id="zip"
          type="file"
          className="form-control"
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            ApiHelper.uploadFiles(this.fileUpload.files[0], {
              cookie: this.state.cookie.forRequest,
            })
              .then((response) => {
                console.log(response);
              })
              .catch((e) => {
                console.log('error on upload', e);
              });
          }}
        >
          Upload
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
  errorState() {
    return this.state.error ? <div id="err-state">{this.state.error.message}</div> : null;
  }
  downloadState() {
    return this.state.download ? <div id="download-state">{this.state.download}</div> : null;
  }
  handleSelect(dates) {
    this.setState({ movesDownloadDateRange: dates });
  }
  render() {
    return (
      <div className="container">
        <div>
          <div id="tabs">
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
                  this.donwloadTab = tab;
                }}
                onClick={(e) => {
                  this.setState({ activeTab: this.uploadTab });
                }}
                title="Upload"
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
              <div id="req-state" className={`${this.state.loading ? 'show' : 'hide'}`}>
                Requesting your data...
              </div>

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
                id="download-section"
              >
                {this.downloadSection()}
              </div>
              <div
                role="tabpanel"
                className={`tab-pane ${this.state.activeTab === this.uploadTab ? 'active' : null}`}
                id="upload-section"
              >
                {this.uploadSection()}
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

        <div id="downloadMovesModal" className="modal fade" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Download options</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.errorState()}
                {this.downloadState()}
                <div className="form-group">
                  <h3>Email</h3>
                  <div>
                    <label htmlFor="email">Please provide your email</label>
                    <input
                      className="form-control"
                      placeholder="you@email.com"
                      type="text"
                      name="email"
                      onBlur={(e) => {
                        this.setState({ movesDownloadEmail: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div id="move-download-format" className="form-group">
                  <h3>Format</h3>
                  <div>
                    <label htmlFor="format">
                      Please select a format in which you would like your files.
                    </label>
                    <div>
                      <select
                        className="form-control"
                        name="format"
                        id="format"
                        value={this.state.movesDownloadFormat}
                        onChange={(e) => {
                          this.setState({ movesDownloadFormat: e.target.value });
                        }}
                      >
                        <option value="gpx">gpx</option>
                        <option value="tcx">tcx</option>
                        <option value="fit">fit</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div id="move-download-dates" className="form-group">
                  <h3>Date Range</h3>
                  <label htmlFor="all-dates">Download All Moves?</label>&nbsp;
                  <input
                    className="form-control"
                    type="checkbox"
                    name="all-dates"
                    checked={`${this.state.hideDateRange ? 'checked' : ''}`}
                    onChange={() => {
                      this.setState({ hideDateRange: !this.state.hideDateRange });
                    }}
                  />
                  {!this.state.hideDateRange ? null : (
                    <div>
                      <p>
                        Note, the more you request, the longer it will take to provdie your exported
                        files.
                      </p>
                    </div>
                  )}
                  {!this.state.hideDateRange ? (
                    <div>
                      <DateRange onChange={this.handleSelect.bind(this)} />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    this.downloadMyMoves();
                  }}
                >
                  Download Moves
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Options;
