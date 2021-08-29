import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setPosition({ latitude: coords.latitude, longitude: coords.longitude }),
      setError,
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  return { ...position, error };
}
