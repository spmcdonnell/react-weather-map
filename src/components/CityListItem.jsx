import React, { Component } from 'react';

class CityListItem extends Component {
  handleListItemClick = cityId => {
    const clickItemMarker = this.props.markers.filter(
      marker => marker.id === cityId
    );
    clickItemMarker[0].weatherDataWindow.open(
      clickItemMarker.map,
      clickItemMarker
    );
  };

  render() {
    return (
      <li>
        <a
          href="#"
          onMouseOver={() => {
            this.handleListItemClick(this.props.id);
          }}
        >
          {this.props.cityName}
        </a>
      </li>
    );
  }
}

export default CityListItem;
