import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import ParcelRow from "./ParcelRow";
import ProgressBar from "./ProgressBar";
import {
  filterParcels,
  getHighPotentialParcels,
  getTop50Parcels,
  exportParcelsToCSV,
} from "../utils/ParcelUtils";
import { useNavigate } from "react-router-dom";

const ParcelsTable = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);

  const [minZoningFitScore, setMinZoningFitScore] = useState("");
  const [maxZoningFitScore, setMaxZoningFitScore] = useState("");
  const [minAcreage, setMinAcreage] = useState("");
  const [maxAcreage, setMaxAcreage] = useState("");

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/parcels/richland`;

    const fetchStream = async () => {
      const response = await fetch(url);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let totalRead = 0;
      let count = 0;
      let liveParcels = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalRead += value.length;
        buffer += decoder.decode(value, { stream: true });

        let lines = buffer.split("\n");
        buffer = lines.pop();

        for (let line of lines) {
          if (!line.trim()) continue;
          try {
            const parcel = JSON.parse(line);
            liveParcels.push(parcel);
            count++;
            if (count % 50 === 0) {
              setParcels([...liveParcels]);
              setFilteredParcels([...liveParcels]);
              setLoadingProgress(Math.min(95, Math.floor((count / 5000) * 100)));
            }
          } catch (e) {
            console.warn("Malformed JSON line:", line);
          }
        }
      }

      if (buffer.trim()) {
        try {
          const parcel = JSON.parse(buffer);
          liveParcels.push(parcel);
        } catch (e) {
          console.warn("Trailing malformed line:", buffer);
        }
      }

      setParcels(liveParcels);
      setFilteredParcels(liveParcels);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 300);
    };

    fetchStream().catch((err) => {
      console.error("Error fetching stream:", err);
      setIsLoading(false);
    });
  }, []);

  const handleFilter = () => {
    const result = filterParcels(
      parcels,
      minZoningFitScore,
      maxZoningFitScore,
      minAcreage,
      maxAcreage
    );
    setFilteredParcels(result);
  };

  const handleReset = () => {
    setMinZoningFitScore("");
    setMaxZoningFitScore("");
    setMinAcreage("");
    setMaxAcreage("");
    setFilteredParcels(parcels);
  };

  const handleHighPotential = () => {
    setFilteredParcels(getHighPotentialParcels(parcels));
  };

  const handleTop50 = () => {
    setFilteredParcels(getTop50Parcels(parcels));
  };

  const handleExportCSV = () => {
    exportParcelsToCSV(filteredParcels);
  };

  const navigate = useNavigate();

  const handleViewInMaps = () => {
    if (!filteredParcels.length) {
      alert("No parcels to display.");
      return;
    }
    navigate("/map", { state: { parcels: filteredParcels } });
  };

  return (
    <div className="p-8 max-w-full bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-green-500">
        Richland County Qualified Parcels
      </h1>

      {isLoading && <ProgressBar progress={loadingProgress} />}

      {!isLoading && (
        <>
          <div className="mb-4 text-lg text-gray-900 font-semibold select-none">
            Showing <span className="text-blue-600">{filteredParcels.length}</span> parcel
            {filteredParcels.length !== 1 && "s"}
          </div>

          <div className="mb-6 flex flex-wrap gap-6 items-end">
            {[{
              label: "Min Zoning Score", value: minZoningFitScore, setter: setMinZoningFitScore
            }, {
              label: "Max Zoning Score", value: maxZoningFitScore, setter: setMaxZoningFitScore
            }, {
              label: "Min Acreage", value: minAcreage, setter: setMinAcreage
            }, {
              label: "Max Acreage", value: maxAcreage, setter: setMaxAcreage
            }].map(({ label, value, setter }) => (
              <div key={label} className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <button onClick={handleFilter} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md">
              Filter
            </button>
            <button onClick={handleHighPotential} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow-md">
              High Potential
            </button>
            <button onClick={handleTop50} className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-semibold shadow-md">
              Top 50 Leads
            </button>
            <button
              onClick={() => handleViewInMaps()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold shadow-md"
            >
              View in Maps
            </button>
            <button onClick={handleReset} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold shadow-md">
              Reset
            </button>
            <button onClick={handleExportCSV} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-md">
              Export CSV
            </button>
          </div>

          <div className="flex bg-gray-100 font-semibold text-gray-700 rounded-t-lg select-none sticky top-0 z-20 border-b border-gray-300 shadow-sm">
            <div className="w-12 text-right pr-4 py-3 border-r border-gray-300">#</div>
            <div className="w-36 py-3 border-r border-gray-300 text-center">Parcel ID</div>
            <div className="w-52 py-3 border-r border-gray-300 text-center">Owner</div>
            <div className="w-64 py-3 border-r border-gray-300 text-center">Address</div>
            <div className="w-28 py-3 border-r border-gray-300 text-center">Acreage</div>
            <div className="w-24 py-3 border-r border-gray-300 text-center">Zoning</div>
            <div className="w-24 py-3 border-r border-gray-300 text-center">Zoning Score</div>
            <div className="w-24 py-3 border-r border-gray-300 text-center">Investment Score</div>
            <div className="w-28 py-3 border-r border-gray-300 text-center">Owner Type</div>
            <div className="w-24 py-3 border-r border-gray-300 text-center">Years Owned</div>
            <div className="w-32 py-3 border-r border-gray-300 text-center">Zoning Description</div>
            <div className="w-32 py-3 border-r border-gray-300 text-center">GPS</div>
            <div className="w-48 py-3 text-center">Contact Info</div>
          </div>

          <List
            height={600}
            itemCount={filteredParcels.length}
            itemSize={54}
            width="100%"
            itemData={filteredParcels}
            className="rounded-b-lg shadow-inner"
          >
            {ParcelRow}
          </List>
        </>
      )}
    </div>
  );
};

export default ParcelsTable;
