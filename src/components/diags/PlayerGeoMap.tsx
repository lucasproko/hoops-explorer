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
import { IndivStatSet, RosterEntry } from "../../utils/StatModels";

//CSS
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import _ from "lodash";
import { zoom } from "d3";

const MAX_ZOOM_HISTORY = 20;

interface MapComponentProps {
  center?: { lat: number | undefined; lon: number | undefined };
  zoom?: number;
  players: _.CollectionChain<IndivStatSet>;
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

    // Handle cluster mouseover
    markers.on("clustermouseover", function (e: any) {
      const cluster = e.layer;
      const childMarkers = cluster.getAllChildMarkers();
      const top10PlayersInfo = _.uniq(
        childMarkers.slice(0, 20).map((marker: any, idx: number) => {
          const popupContent = marker.getPopup()?.getContent();

          const lines = popupContent.split("<br/>");
          return `<div>${lines?.[0]} | ${lines?.[1]}</div>`;
        })
      )
        .slice(0, 5)
        .concat("<div>...</div>");

      const clusterPopup = L.popup({
        closeButton: false,
        autoClose: true,
        className: "cluster-popup",
        offset: L.point(0, -10),
      })
        .setLatLng(cluster.getLatLng())
        .setContent(`<div>${top10PlayersInfo.join("")}</div>`)
        .openOn(map);

      // Close the popup when mouse leaves the cluster
      cluster.on("mouseout", () => {
        map.closePopup(clusterPopup);
      });
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
        })
          .bindPopup(ReactDOMServer.renderToString(someInfo))
          .bindTooltip(ReactDOMServer.renderToString(someInfo));
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
  resetZoomHistory: (all: boolean) => void;
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
        position: "topleft", // Default position
      },

      onAdd: function (map: L.Map) {
        // Create container for the zoom controls
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control leaflet-control-zoom"
        );

        // Open normal leaderboard with geo bounds
        const openLinkButton = L.DomUtil.create(
          "a",
          "leaflet-control-help",
          container
        );
        openLinkButton.innerHTML = "LL";
        openLinkButton.href = "#"; //(will get overwritten on click, see below)
        openLinkButton.target = "_blank";
        openLinkButton.title =
          "Open normal leaderboard with current geo bounds";

        L.DomEvent.on(openLinkButton, "click", (e) => {
          const currUrl = new URL(window.location.href);
          const currParams = new URLSearchParams(currUrl.search);
          const maybeCurrAdvancedFilter = currParams.get("advancedFilter");

          const minLat = Math.min(
            map.getBounds().getSouth(),
            map.getBounds().getNorth()
          );
          const maxLat = Math.max(
            map.getBounds().getSouth(),
            map.getBounds().getNorth()
          );
          const minLon = Math.min(
            map.getBounds().getEast(),
            map.getBounds().getWest()
          );
          const maxLon = Math.max(
            map.getBounds().getEast(),
            map.getBounds().getWest()
          );

          const newAdvancedFilterFrag = `roster.lat >= ${minLat.toFixed(
            4
          )} AND roster.lat <= ${maxLat.toFixed(
            4
          )} AND roster.lon >= ${minLon.toFixed(
            4
          )} AND roster.lon <= ${maxLon.toFixed(4)}`;
          const newAdvancedFilter = maybeCurrAdvancedFilter
            ? `(${newAdvancedFilterFrag}) AND (${maybeCurrAdvancedFilter})`
            : newAdvancedFilterFrag;

          currParams.set("advancedFilter", newAdvancedFilter);
          currParams.delete("geoCenterLat");
          currParams.delete("geoCenterLon");
          currParams.delete("geoZoom");

          openLinkButton.href =
            _.replace(
              window.location.href.split("?")[0],
              "PlayerLeaderboardGeo",
              "PlayerLeaderboard"
            ) + `?${currParams.toString()}`;
        });

        // Default zoom in button
        const zoomInButton = L.DomUtil.create(
          "a",
          "leaflet-control-zoom-in",
          container
        );
        zoomInButton.innerHTML = "+";
        zoomInButton.href = "#";
        zoomInButton.title = "Zoom in (you can also shift+drag)";

        // Default zoom out button
        const zoomOutButton = L.DomUtil.create(
          "a",
          "leaflet-control-zoom-out",
          container
        );
        zoomOutButton.innerHTML = "-";
        zoomOutButton.href = "#";
        zoomOutButton.title = "Zoom out";

        // Default zoom out button
        const resetButton = L.DomUtil.create(
          "a",
          "leaflet-control-help",
          container
        );
        resetButton.innerHTML = "<<";
        resetButton.href = "#";
        resetButton.title = "Reset map view";

        // Add click handlers for the buttons
        L.DomEvent.on(zoomInButton, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.zoomIn();
        });

        L.DomEvent.on(zoomOutButton, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.zoomOut();
        });

        L.DomEvent.on(resetButton, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.setView([20, 10], 2);
          resetZoomHistory(false);
        });

        if (zoomHistory.length > 0) {
          // Custom "Zoom Out Further" button
          const zoomUndoButton = L.DomUtil.create(
            "a",
            "leaflet-control-help",
            container
          );
          zoomUndoButton.innerHTML = "<"; // Custom symbol for the button
          zoomUndoButton.href = "#";
          zoomUndoButton.title = "Back to previous view";

          L.DomEvent.on(zoomUndoButton, "click", (e) => {
            L.DomEvent.preventDefault(e);
            map.setView(zoomHistory[0].latlon, zoomHistory[0].zoom);
            resetZoomHistory(false);
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
    useMapEvent("movestart", (e) => onBoundsToChange?.());
    useMapEvent("zoomstart", (e) => {
      onBoundsToChange?.();
    });
    useMapEvent("moveend", (e) => eventHandler(e.target));
    useMapEvent("zoomend", (e) => eventHandler(e.target));

    const map = useMap();
    map.on("boxzoomend", (e) => {
      setZoomHistory(
        _.take(
          [{ zoom: map.getZoom(), latlon: map.getCenter() }, ...zoomHistory],
          MAX_ZOOM_HISTORY
        )
      );
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
        resetZoomHistory={(all: boolean) => {
          if (all) setZoomHistory([]);
          else setZoomHistory(_.drop(zoomHistory, 1));
        }}
      />
      <MapEventHandler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={`© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`}
      />
      <MarkerCluster
        players={players.value()}
        savePreZoom={(latlon: L.LatLng, zoom: number) => {
          setZoomHistory(
            _.take([{ zoom, latlon }, ...zoomHistory], MAX_ZOOM_HISTORY)
          );
        }}
      />{" "}
    </MapContainer>
  );
};

export default PlayerGeoMap;
