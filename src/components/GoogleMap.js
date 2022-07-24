import React from 'react';
import GoogleMapReact from 'google-map-react';

import { useGeolocation } from '../utils';

export const Marker = ({ children }) => <>{children}</>;

export const defaultCenter = { lat: 42.007, lng: 21.365 };

const GoogleMap = props => {
  const { latitude: lat, longitude: lng } = useGeolocation();

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: 'AIzaSyBdPnmrg8YonjYq_dp2ub7vzj3vHuu-qvo' }}
      defaultCenter={defaultCenter}
      defaultZoom={13}
      options={{
        fullscreenControl: false,
      }}
      center={lat && lng && { lat, lng }}
      {...props}
    ></GoogleMapReact>
  );
};

export default GoogleMap;
