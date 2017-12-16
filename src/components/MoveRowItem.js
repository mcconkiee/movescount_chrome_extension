import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import '../styles/moverowitem.css';
/**
 * MoveRowItem
 * http://www.movescount.com/Move/ExportRoute/2993249?format=0 (kml)
 http://www.movescount.com/Move/ExportRoute/2993249?format=1 (gpx)
 */
const activityTypeId = {
  running: 3,
  cycling: 4,
  mtBiking: 5
};
export class MoveRowItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const s = this.props.move;
    let icon = 'grav';
    switch (s.ActivityID) {
      case 3: //run
        icon = 'compass';
        break;
      case 4: //cycling
        icon = 'bicycle';
        break;
      case 5: //cycling
        icon = 'bicycle';
        break;
      default:
    }
    const url = `http://www.movescount.com/move/export?id=${s.MoveID}&format=tcx`;
    return (
      <div className={'move-row-item'}>
        <a
          onClick={e => {
            console.log(s, url);
            chrome.downloads.download({
              url: url,
              filename: `${s.MoveID}.gpx` // Optional
            });
          }}
          href={url}
        >
          <div className="row-title">
            <i className={`fa fa-2x fa-${icon}`} aria-hidden="true" />
            <span>
              {moment(s.StartTime).format('MMM DD, YYYY')} / {s.Distance}
            </span>
          </div>
        </a>
      </div>
    );
  }
}

export default MoveRowItem;
