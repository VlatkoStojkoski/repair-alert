import { useState, useEffect } from 'react';
import { axios } from '../../api';

export default function useGetAddress(location) {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        if (!location) return;

        try {
          const url =
            `https://maps.googleapis.com/maps/api/geocode` +
            `/json?latlng=${location.latitude},${location.longitude}` +
            `&key=AIzaSyAxMhStPfQ2hcl3gYOAetT4yxyESBEXnSw`;

          const { data } = await axios.get(url);

          setAddress({
            address: data.results[6].formatted_address.replace(
              'North Macedonia',
              'Macedonia'
            ),
            mapsURL: `https://www.google.com/maps?z=13&q=loc:${location.latitude}+${location.longitude}`,
          });
        } catch (error) {
          setError(error);
        }
      })(),
    [location]
  );

  return [address, error];
}
