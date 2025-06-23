import React from "react";
import { useLocation } from "react-router-dom"; // <-- import this
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ParcelsMapView = () => {
  const location = useLocation(); // ✅ correctly get location from router
  const parcels = location.state?.parcels || [];

  if (parcels.length === 0) {
    return <div className="p-8 text-center text-gray-500">No parcels to display on the map.</div>;
  }

  return (
    <div className="w-full h-screen">
      <MapContainer center={[34.01, -81.03]} zoom={11} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parcels.map((parcel, index) => {
          const lat = parcel?.gps?.lat ?? parcel?.gps_lat;
          const lon = parcel?.gps?.lon ?? parcel?.gps_lon;

          if (!lat || !lon) return null;

          return (
            <Marker key={index} position={[lat, lon]}>
              <Popup>
                <div>
                  <strong>{parcel.owner}</strong><br />
                  {parcel.address || "No address"}<br />
                  Zoning Score: {parcel.zoningFitScore}<br />
                  Investment Score: {parcel.investmentScore}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParcelsMapView;
