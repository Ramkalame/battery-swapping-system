import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.fullscreen/Control.FullScreen.css"; // Import fullscreen CSS
import "leaflet.fullscreen"; // Import fullscreen plugin
import iconShop from "../../../assets/charging-statation.png";
import iconVehicle from "../../../assets/zero-emission4.png";
import iconBike from "../../../assets/e-bike.png";


const LiveTrackingMap = ({ data }) => {
  const customIcon = L.icon({
    iconUrl: iconShop,
    iconSize: [42, 42],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const customIcon2 = L.icon({
    iconUrl: iconVehicle,
    iconSize: [62, 42],
    iconAnchor: [42, 42],
    popupAnchor: [0, -32],
  });
  const customIcon3 = L.icon({
    iconUrl: iconBike,
    iconSize: [82, 62],
    iconAnchor: [32, 32],
    popupAnchor: [0, -32],
  });

  // Helper function to validate coordinates
  const isValidLatLng = (lat, lng) => {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // Filter valid data points with coordinates
  const validData = data.filter((d) =>
    isValidLatLng(
      d?.location?.latitude || d?.location?._latitude,
      d?.location?.longitude || d?.location?._longitude
    )
  );

  const isToday = (date) => {
    const today = new Date();
    const transactionDate = new Date(date);
    return (
      today.getFullYear() === transactionDate.getFullYear() &&
      today.getMonth() === transactionDate.getMonth() &&
      today.getDate() === transactionDate.getDate()
    );
  };

  const getTodaysTransactions = (transactions) => {
    if (!transactions) return 0;
    return transactions.filter((transaction) => isToday(transaction.timestamp)).length;
  };

  const getLatestTransactionDate = (transactions) => {
    if (!transactions || transactions.length === 0) return "No Transactions Yet";
    const latestTransaction = transactions.reduce((latest, current) =>
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );
    const date = new Date(latestTransaction.timestamp);
    return date.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MapContainer
      center={[21.278658, 81.866142]}
      zoom={6}
      scrollWheelZoom={true}
      fullscreenControl={true} // Enable fullscreen control
      zoomControl={false}
      maxZoom={20}
      style={{ height: "500px", width: "100%", borderRadius: "5px" }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Standard">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            attribution='&copy; <a href="https://www.thunderforest.com/maps/spinal-map/">Thunderforest</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      {validData.length > 0 && (
        <MarkerClusterGroup>
          {validData.map((d) => {
            const todaysTransactions = getTodaysTransactions(d.transactions);
            const latestTransactionDate = getLatestTransactionDate(d.transactions);

            return (
              <Marker
                key={d.device_Id || d.id}
                position={[
                  d?.location?.latitude || d?.location?._latitude,
                  d?.location?.longitude || d?.location?._longitude,
                ]}
                icon={
                  d.role === "दुकान"
                    ? customIcon
                    : d.vehicleType === "Scooter"
                      ? customIcon3
                      : customIcon2
                }
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <table className="GisPopBox">
                      <tbody>
                        {d.name && (
                          <tr>
                            <td><strong>Name:</strong></td>
                            <td>{d.name}</td>
                          </tr>
                        )}
                        {d.mobile && (
                          <tr>
                            <td><strong>Mobile:</strong></td>
                            <td>{d.mobile}</td>
                          </tr>
                        )}
                        {d.vehicle && (
                          <tr>
                            <td><strong>Vehicle No:</strong></td>
                            <td>{d.vehicle}</td>
                          </tr>
                        )}
                        <tr>
                          <td><strong>No. of Transactions Today:</strong></td>
                          <td>{todaysTransactions}</td>
                        </tr>
                        <tr>
                          <td><strong>Latest Transaction Date:</strong></td>
                          <td>{latestTransactionDate}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      )}
      <ZoomControl position="bottomright" />
      {validData.length > 0 && <MapEventHandler data={validData} />}
    </MapContainer>
  );
};

export default LiveTrackingMap;

// Additional Map Event Handler Component
const MapEventHandler = ({ data }) => {
  const map = useMap();
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => setUserInteracted(true);

    map.on("zoomstart", handleUserInteraction);
    map.on("dragstart", handleUserInteraction);

    return () => {
      map.off("zoomstart", handleUserInteraction);
      map.off("dragstart", handleUserInteraction);
    };
  }, [map]);

  useEffect(() => {
    if (userInteracted) return;

    if (data.length > 0) {
      const markerArray = data.map((d) =>
        [d?.location?.latitude || d?.location?._latitude, d?.location?.longitude || d?.location?._longitude]
      );

      const bounds = L.latLngBounds(markerArray);
      map.flyToBounds(bounds, { maxZoom: 20 });
    } else {
      map.setView([21.278658, 81.866142], 6);
    }
  }, [data, userInteracted, map]);

  return null;
};
