import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import { IndivStatSet, RosterEntry } from "../utils/StatModels";

//CSS
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import _ from "lodash";

interface MapComponentProps {
  center?: { lat: number | undefined; lon: number | undefined };
  zoom?: number;
  players: IndivStatSet[];
  onBoundsChange?: (
    latLongChecker: (lat: number, lon: number) => boolean,
    info: { lat: number; lon: number; zoom: number }
  ) => void;
}

const defaultIcon = L.icon({
  iconRetinaUrl: iconRetina.src,
  iconUrl: iconMarker.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MarkerCluster = ({ players }: { players: IndivStatSet[] }) => {
  const map = useMap();

  useEffect(() => {
    const markers = L.markerClusterGroup();
    var i = 0;
    players.forEach((player) => {
      const someInfo = (
        <span>
          {player.key || "unknown"}
          <br />
          {player.team || "unknown"}
        </span>
      );
      if (
        player.roster &&
        _.isNumber(player?.roster?.lat) &&
        _.isNumber(player?.roster?.lon)
      ) {
        const marker = L.marker([player.roster.lat, player.roster.lon], {
          icon: defaultIcon,
        }).bindPopup(ReactDOMServer.renderToString(someInfo));
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);

    return () => {
      map.removeLayer(markers);
    };
  }, [map, players]);

  return null;
};

const PlayerGeoMap: React.FC<MapComponentProps> = ({
  players,
  onBoundsChange,
  center,
  zoom,
}) => {
  // Custom hook to handle map events
  const eventHandler = (map: any) => {
    const bounds: L.LatLngBounds = map.getBounds(); // Get the new bounds after move or zoom
    const center: L.LatLng = map.getCenter();
    const zoom: number = map.getZoom();
    const boundsChecker = (lat: number, lon: number) => {
      return bounds.contains(new L.LatLng(lat, lon));
    };
    onBoundsChange?.(boundsChecker, {
      lat: center.lat,
      lon: center.lng,
      zoom,
    });
  };
  const MapEventHandler = () => {
    useMapEvent("moveend", (e) => eventHandler(e.target));
    useMapEvent("zoomend", (e) => eventHandler(e.target));

    return null; // No rendering needed
  };

  return (
    <MapContainer
      center={[
        center && _.isNumber(center?.lat) ? center.lat : 20,
        center && _.isNumber(center?.lon) ? center.lon : 10,
      ]}
      zoom={zoom || 2}
      style={{ height: "60vh", width: "100%" }}
      whenCreated={(map) => {
        eventHandler(map);
      }}
    >
      <MapEventHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerCluster players={players} />{" "}
    </MapContainer>
  );
};

export default PlayerGeoMap;
