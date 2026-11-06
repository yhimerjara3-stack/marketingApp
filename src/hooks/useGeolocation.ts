import { useState } from 'react';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  mapsUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    mapsUrl: null,
    loading: false,
    error: null,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Tu navegador o dispositivo no soporta geolocalización GPS.',
        loading: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        setLocation({
          lat,
          lng,
          mapsUrl,
          loading: false,
          error: null,
        });
      },
      (err) => {
        let errorMsg = 'No pudimos obtener tu ubicación GPS.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Permiso de ubicación denegado. Puedes escribir tu dirección manual.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'Señal de GPS no disponible en este momento.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Tiempo de espera de GPS agotado.';
        }
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const clearLocation = () => {
    setLocation({
      lat: null,
      lng: null,
      mapsUrl: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...location,
    requestLocation,
    clearLocation,
  };
}
