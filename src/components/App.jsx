import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import Sidebar from './Sidebar';
import axios from 'axios';

class App extends Component {
  state = {
    cityData: [],
    searchTerm: '',
    markers: [],
    map: {}
  };

  // Run request for weather data
  componentDidMount() {
    this.getWeatherData();
  }

  // Get the user's input value from Sidebar
  changeSearchTerm = value => {
    this.setState({ searchTerm: value });
  };

  // Grab data from open weather map
  getWeatherData = () => {
    const API_KEY = 'f2d6899155b9415e362735d3cbe36f7b';
    const ROOT_URL = `http://api.openweathermap.org/data/2.5/box/city?appid=${API_KEY}&bbox=-80,69,-74,42,9`;

    axios
      .get(ROOT_URL)
      .then(response => {
        this.setState({ cityData: response.data.list }, this.drawMap());
      })
      .catch(error => {
        console.log('Weather API Call', error);
      });
  };

  hideAllMarkers = map => {
    this.state.markers.forEach(marker => {
      marker.weatherDataWindow.close(map, marker);
    });
  };

  // Google Maps init function
  initMap = () => {
    console.log('Init map called');
    const options = {
      zoom: 8,
      center: new google.maps.LatLng(43.59002, -77.40614)
    };

    // Create map
    const map = new google.maps.Map(document.querySelector('#map'), options);

    // Array of markers to be stored
    let allMarkers = [];

    // Loop through cities and create marker for each
    this.state.cityData.map(city => {
      // Add an infoWindow
      const infowindow = new google.maps.InfoWindow();

      // Add an info window for weather data
      const temp = Math.round(city.main.temp * (9 / 5) + 32);
      const weatherInfo = new google.maps.InfoWindow({
        content: `<h2>${city.name}</h2>
                 <ul>
                   <li>Temperature: ${temp} (°F)</li>
                   <li>Humidity: ${city.main.humidity} (%)</li>
                   <li>Wind: ${city.wind.speed} (MPH)</li>
                 </ul>`
      });

      weatherInfo.setPosition({ lat: city.coord.Lat, lng: city.coord.Lon });
      // Create markers
      const marker = new google.maps.Marker({
        name: city.name,
        id: city.id,
        temp: Math.round(city.main.temp * (9 / 5) + 32),
        humidity: city.main.humidity,
        windSpeed: city.wind.speed,
        position: { lat: city.coord.Lat, lng: city.coord.Lon },
        animation: google.maps.Animation.DROP,
        map: map,
        weatherDataWindow: weatherInfo
      });

      // Show city name on mouseover
      marker.addListener('mouseover', () => {
        infowindow.setContent(`<h2>${city.name}</h2>`);
        infowindow.open(map, marker);
      });

      // Don't keep city name window open when not hovering on marker
      marker.addListener('mouseout', () => {
        infowindow.close(map, marker);
      });

      // Show weather data on click
      marker.addListener('click', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 200);
        this.hideAllMarkers(map);
        weatherInfo.open(map, marker);
      });

      google.maps.event.addListener(marker, 'click', () => {
        map.setCenter(marker.position);
        map.panBy(0, -125);
      });

      // Collect markers in array
      allMarkers.push(marker);
    });

    window.customMap = map;
    this.setState({ markers: allMarkers });
  };

  // Create script with proper API key
  drawMap = () => {
    const API_KEY = 'AIzaSyCG-3_Y2631GsHrlXcYjpi_qnCsgzu8sjo';
    createGoogleMapScript(API_KEY).then(value => {
      console.log(value);
    });
    window.initMap = this.initMap;
  };

  render() {
    this.state.markers.forEach(marker => {
      marker.name.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) ==
      -1
        ? marker.setVisible(false)
        : marker.setVisible(true);
    });

    return (
      <div className="app-wrapper">
        <Sidebar
          cityData={this.state.cityData}
          searchTerm={this.state.searchTerm}
          changeSearchTerm={term => {
            this.changeSearchTerm(term);
          }}
          markers={this.state.markers}
        />
        <GoogleMap />
      </div>
    );
  }
}

// Helper function to load map script
function createGoogleMapScript(apiKey) {
  return new Promise((resolve, reject) => {
    const mapScript = document.createElement('script');
    mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    mapScript.defer = true;
    mapScript.async = true;
    mapScript.crossorigin = true;
    mapScript.addEventListener('load', function() {
      resolve(window.google);
    });
    mapScript.addEventListener('error', function(event) {
      reject(event);
    });
    document.body.appendChild(mapScript);
  });
}

export default App;
