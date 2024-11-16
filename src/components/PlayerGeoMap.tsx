import React, { useEffect, useState } from "react";
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
import { zoom } from "d3";

interface MapComponentProps {
  center?: { lat: number | undefined; lon: number | undefined };
  zoom?: number;
  players: IndivStatSet[];
  onBoundsToChange?: () => void;
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

const MarkerCluster = ({
  players,
  savePreZoom,
}: {
  savePreZoom: (latlon: L.LatLng, zoom: number) => void;
  players: IndivStatSet[];
}) => {
  const map = useMap();

  useEffect(() => {
    const markers = L.markerClusterGroup();
    markers.on("clusterclick", function (a) {
      savePreZoom(map.getCenter(), map.getZoom());
    });

    var i = 0;
    players.forEach((player) => {
      const someInfo = (
        <span>
          {player?.key || "unknown"}
          <br />
          {player?.team || "unknown"}
          <br />
          <br />
          {player?.roster?.origin || "unknown"}
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

type CustomZoomControlProps = {
  zoomHistory: { zoom: number; latlon: L.LatLng }[];
  resetZoomHistory: () => void;
};
const CustomZoomControl: React.FC<CustomZoomControlProps> = ({
  zoomHistory,
  resetZoomHistory,
}) => {
  const map = useMap();

  useEffect(() => {
    // Create a new custom control that extends L.Control.Zoom
    const customZoomControl = L.Control.extend({
      options: {
        position: "topright", // Default position
      },

      onAdd: function (map: L.Map) {
        // Create container for the zoom controls
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control leaflet-control-zoom"
        );

        // Default zoom in button
        const zoomInButton = L.DomUtil.create(
          "a",
          "leaflet-control-zoom-in",
          container
        );
        zoomInButton.innerHTML = "+";
        zoomInButton.href = "#";
        zoomInButton.title = "Zoom in";

        // Default zoom out button
        const zoomOutButton = L.DomUtil.create(
          "a",
          "leaflet-control-zoom-out",
          container
        );
        zoomOutButton.innerHTML = "-";
        zoomOutButton.href = "#";
        zoomOutButton.title = "Zoom out";

        // Add click handlers for the buttons
        L.DomEvent.on(zoomInButton, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.zoomIn();
        });

        L.DomEvent.on(zoomOutButton, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.zoomOut();
        });

        if (zoomHistory.length > 0) {
          // Custom "Zoom Out Further" button
          const zoomUndoButton = L.DomUtil.create(
            "a",
            "leaflet-control-zoom-out",
            container
          );
          zoomUndoButton.innerHTML = "<"; // Custom symbol for the button
          zoomUndoButton.href = "#";
          zoomUndoButton.title = "Back to previous view";

          L.DomEvent.on(zoomUndoButton, "click", (e) => {
            L.DomEvent.preventDefault(e);
            map.setView(zoomHistory[0].latlon, zoomHistory[0].zoom);
            resetZoomHistory();
          });
        }
        return container;
      },
    });

    // Add the new control to the map
    const controlInstance = new customZoomControl();
    map.addControl(controlInstance);

    return () => {
      map.removeControl(controlInstance);
    };
  }, [map, zoomHistory]);

  return null;
};

const PlayerGeoMap: React.FC<MapComponentProps> = ({
  players,
  onBoundsChange,
  onBoundsToChange,
  center,
  zoom,
}) => {
  // Zoom logic
  const [zoomHistory, setZoomHistory] = useState<
    { zoom: number; latlon: L.LatLng }[]
  >([]);

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
    //TODO: how to decide how to add to zoom history?

    useMapEvent("movestart", (e) => onBoundsToChange?.());
    useMapEvent("zoomstart", (e) => {
      onBoundsToChange?.();
    });
    useMapEvent("moveend", (e) => eventHandler(e.target));
    useMapEvent("zoomend", (e) => eventHandler(e.target));

    const map = useMap();
    map.on("boxzoomend", (e) => {
      setZoomHistory([
        { zoom: map.getZoom(), latlon: map.getCenter() },
        ...zoomHistory,
      ]);
    });

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
      zoomControl={false}
    >
      <CustomZoomControl
        zoomHistory={zoomHistory}
        resetZoomHistory={() => setZoomHistory(_.drop(zoomHistory, 1))}
      />
      <MapEventHandler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={`© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`}
      />
      <MarkerCluster
        players={players}
        savePreZoom={(latlon: L.LatLng, zoom: number) => {
          setZoomHistory([{ zoom, latlon }, ...zoomHistory]);
        }}
      />{" "}
    </MapContainer>
  );
};

export default PlayerGeoMap;
