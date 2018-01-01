import React, { Component } from 'react';
import ConvertUnits from 'convert-units';
import geolib from 'geolib';
import moment from 'moment';

import togeojson from 'togeojson';
import ApiHelper from '../js/ApiHelper';
import { connect } from 'react-redux';
import reducers from '../redux/reducers';
import { setGPX } from '../redux/actions';
import MovesMap from './MovesMap';
import '../styles/moverowitem.scss';

const DOMParser = require('xmldom').DOMParser;

class MoveRowItem extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, geojson: null };
  }
  componentWillMount() {
    this.data = this.props.move;
  }
  render() {
    const s = this.data;
    const url = `http://www.movescount.com/move/export?id=${s.MoveID}&format=gpx`;
    let distance = ConvertUnits(s.Distance)
      .from('m')
      .to('mi');
    distance = distance.toFixed(2);
    const suffix = ' miles';
    return (
      <div className="card mb-3 move-row-item">
        <h3 className="card-header row-title">
          <i className={`icon-${s.ActivityID} row-item-icon`} />
          <span className={`icon-${s.ActivityID} icon-text`}>
            {moment(s.StartTime).format('MMM DD, YYYY')} / {distance} {suffix}
          </span>
          <small>
            <button
              onClick={() => {
                if (this.state.loading) {
                  return;
                }
                this.setState({ loading: true });
                ApiHelper.fetch(url)
                  .then((response) => {
                    const dom = new DOMParser().parseFromString(response, 'text/xml');
                    const geojson = togeojson.gpx(dom);
                    this.setState({ loading: false, geojson });
                    // this.props.dispatch(setGPX(geojson));
                  })
                  .catch((error) => {
                    this.setState({ loading: false, error });
                    this.props.onError(error);
                  });
              }}
              className={`card-link btn btn-secondary ${this.state.loading ? 'disabled' : null}`}
            >
              map
            </button>
          </small>
        </h3>
        <div className="card-body">
          <h5 className="card-title">
            {distance}
            {suffix}
          </h5>
          <h6 className="card-subtitle text-muted">{s.MoveID}</h6>
        </div>
        <div className="card-body">
          {this.state.loading ? 'Loading map...' : null}
          <MovesMap data={this.state.geojson} />
        </div>
        <div className="card-body">
          <button
            onClick={() => {
              if (this.state.loading) {
                return;
              }
              chrome.downloads.download({
                url,
                filename: `${s.MoveID}.gpx`, // Optional
              });
            }}
            className={`card-link btn btn-secondary ${this.state.loading ? 'disabled' : null}`}
          >
            gpx
          </button>
          <button
            onClick={() => {
              if (this.state.loading) {
                return;
              }
              chrome.downloads.download({
                url,
                filename: `${s.MoveID}.tcx`, // Optional
              });
            }}
            className={`card-link btn btn-secondary ${this.state.loading ? 'disabled' : null}`}
          >
            tcx
          </button>
        </div>
      </div>
    );
  }
}
MoveRowItem = connect(reducers)(MoveRowItem);
export default MoveRowItem;
