import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../hooks/useLocation';
import L from 'leaflet';

// This part fixes an issue where the default marker icon doesn't show up
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41] 
});
L.Marker.prototype.options.icon = DefaultIcon;


const MapView = () => {
  const { latitude, longitude, error } = useLocation();

  if (error) {
    return <div style={{padding: '20px'}}>Error: {error}</div>;
  }

  if (latitude === null || longitude === null) {
    return <div style={{padding: '20px'}}>Loading map... Please grant location access.</div>;
  }

  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>You are here!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;