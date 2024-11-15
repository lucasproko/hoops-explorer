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
  players: IndivStatSet[];
  //TODO: also need to capture center/zoom and render back
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
      if (_.isNumber(player?.roster?.lat) && _.isNumber(player?.roster?.lon)) {
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
}) => {
  // Custom hook to handle map events
  const MapEventHandler = () => {
    useMapEvent("moveend", (e) => {
      const bounds: L.LatLngBounds = e.target.getBounds(); // Get the new bounds after move or zoom
      const center: L.LatLng = e.target.getCenter();
      const zoom: number = e.target.getZoom();
      const boundsChecker = (lat: number, lon: number) => {
        return bounds.contains(new L.LatLng(lat, lon));
      };
      onBoundsChange?.(boundsChecker, {
        lat: center.lat,
        lon: center.lng,
        zoom,
      });
    });

    useMapEvent("zoomend", (e) => {
      const bounds: L.LatLngBounds = e.target.getBounds();
      const center: L.LatLng = e.target.getCenter();
      const zoom: number = e.target.getZoom();
      const boundsChecker = (lat: number, lon: number) => {
        return bounds.contains(new L.LatLng(lat, lon));
      };
      onBoundsChange?.(boundsChecker, {
        lat: center.lat,
        lon: center.lng,
        zoom,
      });
    });

    return null; // No rendering needed
  };
  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      style={{ height: "60vh", width: "100%" }}
    >
      <MapEventHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerCluster players={players} />{" "}
    </MapContainer>
  );
};

export default PlayerGeoMap;
