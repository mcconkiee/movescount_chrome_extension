import React, { Component } from 'react';
import ConvertUnits from 'convert-units';
import geolib from 'geolib';
import moment from 'moment';

import togeojson from 'togeojson';
import ApiHelper from '../js/ApiHelper';
import { connect } from 'react-redux';
import reducers from '../redux/reducers';
import { setGPX } from '../redux/actions';
import '../styles/moverowitem.scss';

const DOMParser = require('xmldom').DOMParser;

class MoveRowItem extends Component {
  render() {
    const s = this.props.move;
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
              console.log(s, url);
              chrome.downloads.download({
                url,
                filename: `${s.MoveID}.gpx`, // Optional
              });
            }}
            className="card-link btn btn-secondary"
          >
            gpx
          </button>
          <button
            onClick={() => {
              ApiHelper.fetch(url)
                .then((response) => {
                  console.log(response, 'geo?');
                  const dom = new DOMParser().parseFromString(response, 'text/xml');
                  const geojson = togeojson.gpx(dom);
                  console.log(geojson, 'geo converstion?');

                  this.props.dispatch(setGPX(geojson));
                })
                .catch((error) => {
                  this.props.onError(error);
                });
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
MoveRowItem = connect(reducers)(MoveRowItem);
export default MoveRowItem;
