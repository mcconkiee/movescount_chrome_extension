import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline, GeoJSON } from 'react-leaflet';
import Leaflet from 'leaflet';
import '../styles/movemap.scss';

const mapboxUrl =
  'https://api.mapbox.com/styles/v1/mcconkiee/cj81wg9hw98g92rqmsfvj50zl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNjb25raWVlIiwiYSI6ImNpdWhhaGVmNDAwMDMyenFkNzhyenhuZXIifQ.XfcDN8aXK5UawZLuED6HrQ';

export class MovesMap extends Component {
  componentDidUpdate() {
    const { data } = this.props;
    const self = this;
    setTimeout(() => {
      if (data && data.features && self.map) {
        const coordinates = data.features[0].geometry.coordinates || [];
        const positions = coordinates.map(c => [c[1], c[0]]);
        const bounds = Leaflet.latLngBounds(positions);
        self.map.leafletElement.fitBounds(bounds);
      }
    }, 300);
  }
  renderMap() {
    if (!this.props.data || !this.props.data.features) {
      return null;
    }

    const { data } = this.props;
    const { features } = data;
    const { geometry, properties } = features[0];
    const { coordinates } = geometry;
    const positions = coordinates.map(c => [c[1], c[0]]);
    const center = [coordinates[0][1], coordinates[0][0]];
    const { name } = properties.name;

    return (
      <div id="map-container">
        <Map
          scrollWheelZoom={false}
          center={center}
          zoom={13}
          ref={(map) => {
            this.map = map;
          }}
        >
          <TileLayer url={mapboxUrl} attribution="<attribution>" />
          <Polyline positions={positions} />
          <GeoJSON data={this.props.data} />
          <Marker position={center}>
            <Popup>
              <span>{name}</span>
            </Popup>
          </Marker>
        </Map>
      </div>
    );
  }

  render() {
    return <div id="map">{this.renderMap()}</div>;
  }
}

export default MovesMap;
