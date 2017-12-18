import moment from 'moment';
import React, { Component, PropTypes } from 'react';

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
            <i className={`icon-${s.ActivityID} row-item-icon`} />
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
