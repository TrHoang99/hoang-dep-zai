
import { render } from 'react-dom';
import { withScriptjs } from "react-google-maps";
import Map from './App';
import './index.css';

const App = () => {
  const MapLoader = withScriptjs(Map);
  return (
    <div >
    <MapLoader
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAcQjrfAudzl6Ton7GA7D-gVqOINMFE7ns&libraries=places"
      loadingElement={<div style={{ height: `50%` }} />}  
    />
    </div>
  );
};

render(<App />, document.getElementById('root'));