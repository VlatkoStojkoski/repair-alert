import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import useSupercluster from 'use-supercluster';
import { Box, Button, Flex, Image } from '@chakra-ui/react';

import GoogleMap, { Marker } from '../../components/GoogleMap';

const MapView = ({ data }) => {
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const mapRef = useRef();
  const history = useHistory();

  const points = data.map(post => ({
    type: 'Feature',
    properties: {
      cluster: false,
      postId: post.id,
      category: post.category,
    },
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(post.location.longitude),
        parseFloat(post.location.latitude),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <Box h="fill_h" w="100%">
      <GoogleMap
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
        }}
      >
        {clusters.map((cluster, clusterI) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <Flex
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                  w={`${10 + (pointCount / points.length) * 20}px`}
                  h={`${10 + (pointCount / points.length) * 20}px`}
                  color="#fff"
                  bg="brand_red.600"
                  borderRadius="50%"
                  p="10px"
                  justifyContent="center"
                  alignItems="center"
                  boxSizing="content-box"
                >
                  {pointCount}
                </Flex>
              </Marker>
            );
          }

          return (
            <Marker
              key={`post-${cluster.properties.postId}`}
              lat={latitude}
              lng={longitude}
            >
              <Button
                onClick={() =>
                  history.push(`/post/${cluster.properties.postId}`)
                }
                variant="ghost"
                colorScheme="transparent"
                transform="translate(-50%, -50%)"
                p="0"
              >
                <Image
                  w="25px"
                  src={`/${cluster.properties.category}.svg`}
                  alt="post category icon"
                />
              </Button>
            </Marker>
          );
        })}
      </GoogleMap>
    </Box>
  );
};

export default MapView;
