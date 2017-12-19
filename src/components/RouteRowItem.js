import ApiHelper from '../js/ApiHelper';
import ConverUnits from 'convert-units';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import togpx from 'togpx';
import '../styles/moverowitem.scss';
/**
 * RouteRowItem
 */
export class RouteRowItem extends Component {
  constructor(props) {
    super(props);
  }
  downloadFile(json) {
    console.log(json, 'json');
    let coordinates = [];
    json.points.latitudes.forEach((lat, idx) => {
      const lng = json.points.longitudes[idx];
      let obj = [lng, lat];
      if (json.points.altitudes && json.points.altitudes.length > 0) {
        obj.push(json.points.altitudes[idx]);
      }
      coordinates.push(obj);
    });
    const geoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: this.props.route.Name },
          geometry: { type: 'LineString', coordinates: coordinates }
        }
      ]
    };
    const forBlob = togpx(geoJson);
    console.log(forBlob, 'forBlob');
    const blob = new Blob([forBlob], { type: 'application/gpx+xml' });
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = `${this.props.route.RouteID}.gpx`;

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }
  render() {
    const self = this;
    const s = this.props.route;
    const url = '#';
    let distance = ConverUnits(s.Distance)
      .from('m')
      .to('mi');
    distance = Math.round(distance).toFixed(2);
    let suffix = 'miles';
    return (
      <div className={'move-row-item'}>
        <a
          onClick={e => {
            ApiHelper.fetch(
              `http://www.movescount.com/Move/Route/${this.props.route.RouteID}`
            )
              .then(response => {
                self.downloadFile(response);
              })
              .catch(error => {
                self.setState({ error: error });
              });
          }}
          href={url}
        >
          <div className="row-title">
            <i className={`icon-${s.ActivityID} row-item-icon`} />
            <span className={`icon-${s.ActivityID} icon-text`}>
              {s.Name} / {distance}
              {suffix}
            </span>
          </div>
        </a>
      </div>
    );
  }
}

export default RouteRowItem;
