import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import stateCountyData from "../data/counties_by_state.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";



const UserPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openState, setOpenState] = useState(null);
  const navigate = useNavigate();

  const toggleState = (stateName) => {
    setOpenState(openState === stateName ? null : stateName);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">🏠 My UserPage</h1>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/view-table" className="text-gray-700 hover:text-blue-600">Profile</Link>
          <Link to="/view-maps" className="text-gray-700 hover:text-blue-600">Help Center</Link>
          <Link to="/view-maps" className="text-gray-700 hover:text-blue-600">Contact Us</Link>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Logout</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* View in Table Section */}
        <section className="bg-white shadow rounded-lg p-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">📊 View in Table</h2>

          {/* Display selected state's counties above the grid */}
          {openState && (
            <div className="mb-6 border border-blue-200 rounded p-4 bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-blue-800">
                  📍 Counties in {openState}
                </h3>
                <button
                  onClick={() => setOpenState(null)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
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
                    className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-700 px-3 py-2 text-sm rounded shadow-sm transition"
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
                  <h3 className="text-lg font-semibold text-blue-700">{state}</h3>
                  <button
                    onClick={() => toggleState(state)}
                    className="text-blue-600 hover:text-blue-800 text-lg"
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🗺️ View in Maps</h2>
          <div className="h-full rounded overflow-hidden">
            <MapContainer
              center={[37.8, -96]} // Center of USA
              zoom={4}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Example Marker: You can replace or loop based on county lat/lng */}
              <Marker position={[34.73, -86.59]}>
                <Popup>Example County (e.g. Madison County, AL)</Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-gray-500 text-sm p-4 border-t">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </div>
  );
};

export default UserPage;
