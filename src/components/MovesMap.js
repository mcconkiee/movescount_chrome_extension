import React, { Component, PropTypes } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
/**
 * MovesMap
 */
export class MovesMap extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const position = [51.505, -0.09];
    const map = (
      <Map center={position} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>
            <span>
              A pretty CSS3 popup.<br />Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    );
    return <div id="map">{map}</div>;
  }
}

export default MovesMap;
