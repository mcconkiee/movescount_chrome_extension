import ConverUnits from 'convert-units';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import geolib from 'geolib';
// import togpx from 'togpx';
import { setGPX } from '../redux/actions';
import ApiHelper from '../js/ApiHelper';
import Constants from '../js/Constants';
import reducers from '../redux/reducers';
import '../styles/moverowitem.scss';
/**
 * RouteRowItem
 */
export class RouteRowItem extends Component {
  constructor(props) {
    super(props);
    const useMetric = localStorage.getItem(Constants.storageKeys.USE_METRIC) || false;
    this.state = { dataForMap: null, useMetric: useMetric === 'true' };
  }

  // downloadFile(json) {
  //   const geoJson = geolib.geoJsonForData(json);
  //   const forBlob = togpx(geoJson);
  //   const blob = new Blob([forBlob], { type: 'application/gpx+xml' });
  //   const a = window.document.createElement('a');
  //   a.href = window.URL.createObjectURL(blob);
  //   a.download = `${this.props.route.RouteID}.gpx`;

  //   // Append anchor to body.
  //   document.body.appendChild(a);
  //   a.click();

  //   // Remove anchor from body
  //   document.body.removeChild(a);
  // }
  fetchRouteDetails() {
    const self = this;
    return new Promise((resolve) => {
      ApiHelper.fetch(`http://www.movescount.com/Move/Route/${self.props.route.RouteID}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          self.setState({ error });
        });
    });
  }
  render() {
    const self = this;
    const s = this.props.route;
    let distance = ConverUnits(s.Distance)
      .from('m')
      .to('mi');
    distance = Math.round(distance).toFixed(2);
    const suffix = this.state.useMetric ? 'kms' : 'miles';
    if (this.state.useMetric) {
      distance = s.Distance / 1000;
    }
    return (
      <div className="card mb-3 move-row-item">
        <h3 className="card-header row-title">
          <i className={`icon-${s.ActivityID} row-item-icon`} />
          <span className={`icon-${s.ActivityID} icon-text`}>{s.Name}</span>
        </h3>
        <div className="card-body">
          <h5 className="card-title">
            {distance}
            {suffix}
          </h5>
          <h6 className="card-subtitle text-muted">Support card subtitle</h6>
        </div>
        <div className="card-body">        
          <button
            onClick={() => {
              //http://www.movescount.com/Move/ExportRoute/3030464?format=gpx
              const url = `http://www.movescount.com/Move/ExportRoute/${s.RouteID}?format=gpx`
              chrome.downloads.download({
                url,
                filename: `${s.RouteID}.gpx`, // Optional
              });
              // self.fetchRouteDetails().then((r) => {
              //   self.downloadFile(r);
              // });
            }}
            className="card-link btn btn-secondary"
          >
            gpx
          </button>
          <button
            onClick={() => {
              if (!this.state.dataForMap) {
                self.fetchRouteDetails().then((r) => {
                  const dta = self.geoJsonForData(r);
                  this.props.dispatch(setGPX(dta));
                });
              } else {
                this.setState({ dataForMap: null });
              }
            }}
            className="card-link btn btn-secondary"
          >
            map
          </button>
        </div>
      </div>
    );
  }
}
RouteRowItem = connect(reducers)(RouteRowItem);
export default RouteRowItem;
