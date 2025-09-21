import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prevState => ({
        ...prevState,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation(prevState => ({
        ...prevState,
        error: error.message,
      }));
    };

    const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
    });

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return location;
};