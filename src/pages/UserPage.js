import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import stateCountyData from "../data/counties_by_state.json";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// Custom map style
const mapStyle = {
  filter: "hue-rotate(60deg) saturate(1.5) brightness(0.9)",
};

// State coordinates (latitude, longitude, zoom level)
const stateCoordinates = {
  "Alabama": { center: [32.7794, -86.8287], zoom: 7 },
  "Alaska": { center: [64.0685, -152.2782], zoom: 4 },
  "Arizona": { center: [34.2744, -111.6602], zoom: 7 },
  "Arkansas": { center: [34.8938, -92.4426], zoom: 7 },
  "California": { center: [36.7783, -119.4179], zoom: 6 },
  "Colorado": { center: [39.5501, -105.7821], zoom: 7 },
  "Florida": { center: [27.6648, -81.5158], zoom: 7 },
  "Georgia": { center: [32.9406, -83.3789], zoom: 7 },
  "Hawaii": { center: [20.2927, -156.3737], zoom: 7 },
  "Idaho": { center: [44.0682, -114.7420], zoom: 6 },
  "Illinois": { center: [40.0417, -89.1965], zoom: 7 },
  "Indiana": { center: [39.8497, -86.2578], zoom: 7 },
  "Iowa": { center: [42.0751, -93.4960], zoom: 7 },
  "Kansas": { center: [38.5266, -96.7265], zoom: 7 },
  "Kentucky": { center: [37.6681, -84.6701], zoom: 7 },
  "Louisiana": { center: [31.1695, -91.8678], zoom: 7 },
  "Maine": { center: [45.2538, -69.4455], zoom: 7 },
  "Maryland": { center: [39.0458, -76.6413], zoom: 7 },
  "Massachusetts": { center: [42.4072, -71.3824], zoom: 8 },
  "Michigan": { center: [44.3148, -85.6024], zoom: 7 },
  "Minnesota": { center: [46.7296, -94.6859], zoom: 7 },
  "Mississippi": { center: [32.7541, -89.6687], zoom: 7 },
  "Missouri": { center: [38.4561, -92.2884], zoom: 7 },
  "Montana": { center: [46.8797, -110.3626], zoom: 6 },
  "Nebraska": { center: [41.4925, -99.9018], zoom: 7 },
  "Nevada": { center: [38.8026, -116.4194], zoom: 6 },
  "New Hampshire": { center: [43.1939, -71.5724], zoom: 7 },
  "New Jersey": { center: [40.0583, -74.4057], zoom: 8 },
  "New Mexico": { center: [34.5199, -105.8701], zoom: 7 },
  "New York": { center: [42.9538, -75.5268], zoom: 7 },
  "North Carolina": { center: [35.7596, -79.0193], zoom: 7 },
  "North Dakota": { center: [47.5515, -101.0020], zoom: 7 },
  "Ohio": { center: [40.4173, -82.9071], zoom: 7 },
  "Oklahoma": { center: [35.5653, -96.9289], zoom: 7 },
  "Oregon": { center: [43.8041, -120.5542], zoom: 7 },
  "Pennsylvania": { center: [41.2033, -77.1945], zoom: 7 },
  "Rhode Island": { center: [41.5801, -71.4774], zoom: 8 },
  "South Carolina": { center: [33.8361, -81.1637], zoom: 7 },
  "South Dakota": { center: [43.9695, -99.9018], zoom: 7 },
  "Tennessee": { center: [35.7478, -86.6923], zoom: 7 },
  "Texas": { center: [31.9686, -99.9018], zoom: 6 },
  "Utah": { center: [39.3210, -111.0937], zoom: 7 },
  "Vermont": { center: [44.5588, -72.5778], zoom: 7 },
  "Virginia": { center: [37.7693, -78.1700], zoom: 7 },
  "Washington": { center: [47.7511, -120.7401], zoom: 7 },
  "West Virginia": { center: [38.5976, -80.4549], zoom: 7 },
  "Wisconsin": { center: [43.7844, -88.7879], zoom: 7 },
  "Wyoming": { center: [42.7559, -107.3025], zoom: 7 }
};

// Map update component
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [map, center, zoom]);
  return null;
};

const UserPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openState, setOpenState] = useState(null);
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState([37.8, -96]);
  const [mapZoom, setMapZoom] = useState(4);

  const toggleState = (stateName) => {
    setOpenState(openState === stateName ? null : stateName);
    if (stateCoordinates[stateName]) {
      setMapCenter(stateCoordinates[stateName].center);
      setMapZoom(stateCoordinates[stateName].zoom);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500">🏠 My UserPage</h1>
        <nav className="space-x-6">
          <Link to="/" className="text-green-500 hover:text-green-600">Home</Link>
          <Link to="/view-table" className="text-green-500 hover:text-green-600">Profile</Link>
          <Link to="/view-maps" className="text-green-500 hover:text-green-600">Help Center</Link>
          <Link to="/view-maps" className="text-green-500 hover:text-green-600">Contact Us</Link>
          <Link to="/" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Logout</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* View in Table Section */}
        <section className="bg-white shadow rounded-lg p-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-6 text-green-500">📊 View in Table</h2>

          {/* Display selected state's counties above the grid */}
          {openState && (
            <div className="mb-6 border border-green-200 rounded p-4 bg-green-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-green-500">
                  📍 Counties in {openState}
                </h3>
                <button
                  onClick={() => setOpenState(null)}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  aria-label="Go back to states list"
                >
                  ← Go Back
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Object.values(stateCountyData[openState]).map((county) => (
                  <button
                    key={county.fips}
                    onClick={() => navigate(`/parcel-table/${county.fips}`)}
                    className="bg-white border border-gray-300 hover:border-green-500 text-green-500 hover:text-green-600 px-3 py-2 text-sm rounded shadow-sm transition"
                  >
                    {county.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* States Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stateCountyData).map(([state]) => (
              <div
                key={state}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-500">{state}</h3>
                  <button
                    onClick={() => toggleState(state)}
                    className="text-green-500 hover:text-green-600 text-lg"
                    title="Show Counties"
                  >
                    {openState === state ? <FiChevronDown /> : <FiChevronRight />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* View in Maps */}
        <section className="bg-white shadow rounded-lg p-6 h-[80vh]">
          <h2 className="text-xl font-semibold mb-4 text-green-500">🗺️ View in Maps</h2>
          <div className="h-full rounded overflow-hidden">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              className="h-full w-full"
              style={mapStyle}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              
              {openState && stateCoordinates[openState] && (
                <Marker position={stateCoordinates[openState].center}>
                  <Popup>
                    <div className="text-green-500 font-semibold">
                      {openState}
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-green-500 text-sm p-4 border-t">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </div>
  );
};

export default UserPage;
