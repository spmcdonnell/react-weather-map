import React, { Component } from 'react';
import CityListItem from './CityListItem';

class CityList extends Component {
  render() {
    const cityList = this.props.cityData
      .filter(
        city =>
          `${city.name}`
            .toUpperCase()
            .indexOf(this.props.searchTerm.toUpperCase()) !== -1
      )
      .map(city => {
        return (
          <CityListItem
            key={city.id}
            cityName={city.name}
            id={city.id}
            markers={this.props.markers}
          />
        );
      });

    return <ul>{cityList}</ul>;
  }
}

export default CityList;
