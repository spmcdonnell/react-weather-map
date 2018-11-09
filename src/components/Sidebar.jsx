import React, { Component } from 'react';
import CityList from './CityList';

class Sidebar extends Component {
  state = {
    userInput: ''
  };

  handleUserInput = event => {
    this.setState({ userInput: event.target.value });
    this.props.changeSearchTerm(event.target.value);
  };

  render() {
    // Prevent errors related to async API call
    let cityName;
    if (this.props.cityData.length === 0) {
      cityName = 'Loading...';
    } else {
      cityName = this.props.cityData[0].name;
    }

    let cityListComponent;
    if (this.props.markers.length === 0) {
      cityListComponent = null;
    } else {
      cityListComponent = (
        <CityList
          searchTerm={this.props.searchTerm}
          markers={this.props.markers}
          cityData={this.props.cityData}
        />
      );
    }

    return (
      <aside className="sidebar">
        <input
          type="text"
          placeholder="Search cities"
          value={this.state.userInput}
          onChange={this.handleUserInput}
        />
        {cityListComponent}
      </aside>
    );
  }
}

export default Sidebar;
