import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline, GeoJSON } from 'react-leaflet';
import Leaflet from 'leaflet';
import '../styles/movemap.scss';

// 'https://api.mapbox.com/styles/v1/mcconkiee/cj81wg9hw98g92rqmsfvj50zl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNjb25raWVlIiwiYSI6ImNpdWhhaGVmNDAwMDMyenFkNzhyenhuZXIifQ.XfcDN8aXK5UawZLuED6HrQ';
const mapboxStyleId = 'cjbzmcuu970xq2qoyqbcytwme';
const mapboxUrl = `https://api.mapbox.com/styles/v1/mcconkiee/${mapboxStyleId}/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNjb25raWVlIiwiYSI6ImNpdWhhaGVmNDAwMDMyenFkNzhyenhuZXIifQ.XfcDN8aXK5UawZLuED6HrQ`;

export class MovesMap extends Component {
  constructor(props) {
    super(props);
    this.state = { insuffientData: false };
  }
  componentDidUpdate() {
    const { data } = this.props;
    const self = this;
    setTimeout(() => {
      if (data && data.features) {
        if (data.features.length === 0) {
          this.setState({ insuffientData: true });
          return;
        }
        const coordinates = data.features[0].geometry.coordinates || [];
        const positions = coordinates.map(c => [c[1], c[0]]);
        const bounds = Leaflet.latLngBounds(positions);
        self.map.leafletElement.fitBounds(bounds);
      }
    }, 300);
  }
  noMapUI() {
    return <div>Insuffient data for this map.</div>;
  }
  renderMap() {
    if (!this.props.data || !this.props.data.features) {
      return this.noMapUI();
    }

    const { data } = this.props;
    const { features } = data;
    if (features.length === 0) {
      return this.noMapUI();
    }
    const { geometry, properties } = features[0];
    const { coordinates } = geometry;
    const positions = coordinates.map(c => [c[1], c[0]]);
    const center = [coordinates[0][1], coordinates[0][0]];
    const { name } = properties.name;
    console.log(data);

    return (
      <div className="map-container">
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
    if (!this.props.data) {
      return <div />;
    }
    return (
      <div className={`moves-map ${this.state.insuffientData ? 'no-geo-data' : null}`}>
        {this.renderMap()}
      </div>
    );
  }
}

export default MovesMap;
