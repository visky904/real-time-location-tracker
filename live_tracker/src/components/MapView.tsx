// 1. Import useState, useEffect, and your config
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../hooks/useLocation';
import { API_URL } from '../config'; // Make sure you created this file
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
  // 2. Add state to hold the places
  const [hotels, setHotels] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);


  // 3. Add useEffect to fetch data when location is available
  useEffect(() => {
    if (latitude && longitude) {
        
        // Fetch nearby hotels
        fetch(`${API_URL}/api/places/nearby?lat=${latitude}&lon=${longitude}&type=hotel`)
            .then(res => res.json())
            .then(data => setHotels(data))
            .catch(err => console.error("Failed to fetch hotels", err));

        // Fetch nearby hospitals
        fetch(`${API_URL}/api/places/nearby?lat=${latitude}&lon=${longitude}&type=hospital`)
            .then(res => res.json())
            .then(data => setHospitals(data))
            .catch(err => console.error("Failed to fetch hospitals", err));
    }
  }, [latitude, longitude]);


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
      {/* User's own location marker */}
      <Marker position={[latitude, longitude]}>
        <Popup>You are here!</Popup>
      </Marker>

      {/* 4. Display markers for hotels and hospitals */}
      {hotels.map((hotel) => (
        <Marker key={hotel.id} position={[hotel.location.lat, hotel.location.lng]}>
            <Popup>{hotel.name}<br/>{hotel.vicinity}</Popup>
        </Marker>
      ))}

      {hospitals.map((hospital) => (
        <Marker key={hospital.id} position={[hospital.location.lat, hospital.location.lng]}>
            <Popup>{hospital.name}<br/>{hospital.vicinity}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;