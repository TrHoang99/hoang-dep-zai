import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
  InfoWindow
} from "react-google-maps";
import * as parksData from "./parking.json" ;
 
class App extends React.Component {
  state = {
    directions: null,
    parkInfo: null,
    origin: {lat: null, lng: null} ,
    destination: {lat: null, lng: null} ,
    pointOrigin: '',
    pointDestination: '',
    distance: 0,
};

  handleChangeOrigin = pointOrigin => {
    this.setState({ pointOrigin });

  };
  handleChangeDestination = pointDestination => {
    this.setState({pointDestination});
  }
 
  handleSelectOrigin = async origin => {
    try {
      const results = await geocodeByAddress(origin);
      const { lat, lng } = await getLatLng(results[0]);

      this.setState({
        origin: { lat,lng }
      });

    } catch (error) {
      console.error('Error', error)
    }
  };

  handleSelectDestination = async destination => {
      try {
        const results = await geocodeByAddress(destination);
        const { lat, lng } = await getLatLng(results[0]);

        this.setState({
          destination: { lat,lng }
        });
        
      } catch (error) {
        console.error('Error', error)
      }
    };


onSearch = () => {
  const { origin, destination } = this.state;
 
  this.setState({
    ...this.state,
      origin,
      destination,
  });

  this.drawDirections();

};
updateParkInfo =  (park) => {
      this.setState({
        ...this.state,
          parkInfo: park
      })
};
resetParkInfo = () => {
      this.setState ({
        parkInfo: null,
      })
};
      
drawDirections = ()  => {
  const directionsService = new window.google.maps.DirectionsService();
  const { origin, destination } = this.state;
  directionsService.route(
    {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        this.setState({
          ...this.state,
          directions: result,
          distance: window.google.maps.geometry.spherical.computeDistanceBetween(origin, destination)
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    }
  );
}
     
  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <div>
      <GoogleMap
          defaultCenter={{ lat: 21.0294498, lng: 105.8544441 }}
          defaultZoom={13}
        >
        <DirectionsRenderer 
            directions= {this.state.directions}
        /> 
        
         {parksData.data.map((park => (
                <Marker 
                  key= {park.id}
                  position = {{lat: parseFloat(park.latitude), lng: parseFloat(park.longitude)}}
                  onClick = {() => {this.setState({parkInfo: park})}}
                  />
               )))}
           { this.state.parkInfo && (
             <InfoWindow 
                position = {{
                      lat: parseFloat(this.state.parkInfo.latitude),
                      lng: parseFloat(this.state.parkInfo.longitude)
                      }}
                onCloseClick={() => {this.setState({parkInfo: null})}}
              >
              <div>Park Details</div>
            </InfoWindow>
           )}
        </GoogleMap>
         </div> 
    ));
    return (
     <div>
      <div>
      
      <PlacesAutocomplete
        value={this.state.pointOrigin}
        onChange={this.handleChangeOrigin}
        onSelect={this.handleSelectOrigin}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>   
            <input
              {...getInputProps({
                placeholder: 'Search Origin ...',
                className: 'location-search-input',
              })} 
            />
            <div className="autocomplete-dropdown-container">
            {loading ? <div>Loading...</div>: null}
              {suggestions.map(suggestion  => {
                  const style = {
                    backgroundColor: suggestion.active? "#42e3f5" : "#fff"
                  };
                return (
                  <div {...getSuggestionItemProps(suggestion, {style})}>
                     {suggestion.description} 
                  </div>
                );
          
              })}
            </div>
          </div>
        )} 
    </PlacesAutocomplete>
    <PlacesAutocomplete
        value={this.state.pointDestination}
        onChange={this.handleChangeDestination}
        onSelect={this.handleSelectDestination}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>   
            <input
              {...getInputProps({
                placeholder: 'Search Destination',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container"  >
              {loading ? <div>Loading...</div>: null}
              {suggestions.map(suggestion  => {
                  const style = {
                    backgroundColor: suggestion.active? "#42e3f5" : "#fff"
                  };
                return (
                  <div {...getSuggestionItemProps(suggestion, {style})}>
                     {suggestion.description} 
                  </div>
                );
              })}
            </div>
          </div>
        )} 
    </PlacesAutocomplete>
    </div>
    <div> 
    <button  type="button" onClick={() => this.onSearch()}>Search</button>    
    <p> Distance: {Math.round(this.state.distance)/1000} km </p> 
         <GoogleMapExample
            containerElement={<div style={{ height: `100vh`, width: "100vw", float:"right" }} />}
            mapElement={<div style={{ height: `100%` }} />}
         /> 
    </div> 
  </div>
    
      
    );
  }
}
export default App;