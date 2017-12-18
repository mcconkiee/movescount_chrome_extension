import ConverUnits from 'convert-units';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import '../styles/moverowitem.scss';
/**
 * RouteRowItem
 */
export class RouteRowItem extends Component {
  constructor(props) {
    super(props);
    console.log('row item ', props);
  }

  render() {
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
            // chrome.downloads.download({
            //   url: url,
            //   filename: `${s.MoveID}.gpx` // Optional
            // });
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
