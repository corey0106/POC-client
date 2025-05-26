import React, { useEffect, useState } from "react";
import axios from "axios";
import { FixedSizeList as List } from "react-window";
import Papa from "papaparse";

// Row renderer for each parcel
const Row = ({ index, style, data }) => {
  const parcel = data[index];
  return (
    <div
      style={style}
      className={`flex items-center py-4 border-b border-gray-200
        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
        hover:bg-blue-100 transition-colors duration-200 cursor-pointer select-none`}
    >
      <div className="w-12 text-right pr-4 font-mono text-gray-500 text-center">{index + 1}</div>
      <div className="w-36 truncate font-semibold text-blue-900 text-center" title={parcel.parcelId}>
        {parcel.parcelId}
      </div>
      <div className="w-52 truncate text-gray-700 text-center" title={parcel.owner}>
        {parcel.owner}
      </div>
      <div className="w-64 truncate text-gray-600 text-center" title={parcel.address}>
        {parcel.address}
      </div>
      <div className="w-28 font-mono text-gray-900 text-center">{parcel.acreage.toFixed(2)}</div>
      <div className="w-24 font-semibold text-indigo-700 text-center">{parcel.zoning}</div>
      <div className="w-24 font-semibold text-green-700 text-center">{parcel.zoningFitScore}</div>
      <div className="w-24 font-semibold text-green-700 text-center">{parcel.investmentScore}</div>
      <div className="w-40 font-mono text-gray-900 text-center">{parcel.assessedValue.toLocaleString()}</div>
      <div className="w-28 text-gray-700 text-center">{parcel.ownerType}</div>
      <div className="w-24 text-gray-600 text-center">{parcel.yearsOwned ?? "N/A"}</div>
      <div className="w-24 text-red-600 font-semibold text-center">{parcel.outOfState ? "Yes" : "No"}</div>
      <div className="w-48 truncate text-blue-700 text-center" title={parcel.contactInfo ?? "N/A"}>
        {parcel.contactInfo ?? "N/A"}
      </div>
    </div>
  );
};

const ParcelsTable = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);

  const [minZoningFitScore, setMinZoningFitScore] = useState("");
  const [maxZoningFitScore, setMaxZoningFitScore] = useState("");
  const [minAcreage, setMinAcreage] = useState("");
  const [maxAcreage, setMaxAcreage] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/parcels/york`)
      .then((res) => {
        setParcels(res.data);
        setFilteredParcels(res.data);
        setLoading(false);
      })
      .catch((err) => 
        {
          console.error("Failed to load parcels:", err);
          setLoading(false);
        });
  }, []);

  const handleFilter = () => {
    const filtered = parcels.filter((parcel) => {
      const zoningScore = parcel.zoningFitScore;
      const acreage = parcel.acreage;
      const zoningScoreValid =
        (minZoningFitScore === "" || zoningScore >= Number(minZoningFitScore)) &&
        (maxZoningFitScore === "" || zoningScore <= Number(maxZoningFitScore));
      const acreageValid =
        (minAcreage === "" || acreage >= Number(minAcreage)) &&
        (maxAcreage === "" || acreage <= Number(maxAcreage));
      return zoningScoreValid && acreageValid;
    });
    setFilteredParcels(filtered);
  };

  const handleReset = () => {
    setMinZoningFitScore("");
    setMaxZoningFitScore("");
    setMinAcreage("");
    setMaxAcreage("");
    setFilteredParcels(parcels);
  };

  // High Potential Filter
  const handleHighPotential = () => {
    const high = parcels.filter(
      (p) => (p.zoningFitScore ?? 0) >= 4.5 && (p.investmentScore ?? 0) >= 4.5
    );
    setFilteredParcels(high);
  };

  // Top 2500 Qualified Leads
  const handleTop2500 = () => {
    const sorted = [...parcels].sort((a, b) => {
      const investDiff = (b.investmentScore ?? 0) - (a.investmentScore ?? 0);
      if (investDiff !== 0) return investDiff;
      return (b.zoningFitScore ?? 0) - (a.zoningFitScore ?? 0);
    });
    setFilteredParcels(sorted.slice(0, 2500));
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredParcels);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "parcels_filtered.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if(loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="w-full max-w-3xl px-8">
          <div className="text-lg font-medium mb-4 text-gray-700">Loading parcels...</div>
          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 animate-slide"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-full bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        York County Qualified Parcels
      </h1>

      <div className="mb-4 text-lg text-gray-900 font-semibold select-none">
        Showing <span className="text-blue-600">{filteredParcels.length}</span> parcel
        {filteredParcels.length !== 1 && "s"}
      </div>

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-6 items-end">
        {/* Numeric Filters */}
        {[{
          label: "Min Zoning Score", value: minZoningFitScore, setter: setMinZoningFitScore, min: 0, max: 5, step: 1
        }, {
          label: "Max Zoning Score", value: maxZoningFitScore, setter: setMaxZoningFitScore, min: 0, max: 5, step: 1
        }, {
          label: "Min Acreage", value: minAcreage, setter: setMinAcreage, min: 0, max: 10000, step: 0.01
        }, {
          label: "Max Acreage", value: maxAcreage, setter: setMaxAcreage, min: 0, max: 10000, step: 0.01
        }].map(({ label, value, setter, min, max, step }) => (
          <div key={label} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={min} max={max} step={step}
              placeholder={label.split(" ")[0]}
            />
          </div>
        ))}

        

        <button onClick={handleHighPotential} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow-md">
          High Potential
        </button>
        <button onClick={handleTop2500} className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-semibold shadow-md">
          Top 2500 Leads
        </button>

        <button onClick={handleFilter} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md">
          Filter
        </button>
        <button onClick={handleReset} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold shadow-md">
          Reset
        </button>
        <button onClick={handleExportCSV} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-md">
          Export CSV
        </button>
      </div>

      {/* Table Header */}
      <div className="flex bg-gray-100 font-semibold text-gray-700 rounded-t-lg select-none sticky top-0 z-20 border-b border-gray-300 shadow-sm">
        <div className="w-12 text-right pr-4 py-3 border-r border-gray-300">#</div>
        <div className="w-36 py-3 border-r border-gray-300 text-center">Parcel ID</div>
        <div className="w-52 py-3 border-r border-gray-300 text-center">Owner</div>
        <div className="w-64 py-3 border-r border-gray-300 text-center">Address</div>
        <div className="w-28 py-3 border-r border-gray-300 text-center">Acreage</div>
        <div className="w-24 py-3 border-r border-gray-300 text-center">Zoning</div>
        <div className="w-24 py-3 border-r border-gray-300 text-center">Zoning Score</div>
        <div className="w-24 px-2 py-3 border-r border-gray-300 text-center">Invest Score</div>
        <div className="w-40 py-3 border-r border-gray-300 text-center">Assessed Value</div>
        <div className="w-28 py-3 border-r border-gray-300 text-center">Owner Type</div>
        <div className="w-24 py-3 border-r border-gray-300 text-center">Years Owned</div>
        <div className="w-24 px-2 py-3 border-r border-gray-300 text-center">Out of State</div>
        <div className="w-48 py-3 text-center">Contact Info</div>
      </div>

      {/* Table Rows */}
      <List
        height={600}
        itemCount={filteredParcels.length}
        itemSize={54}
        width="100%"
        itemData={filteredParcels}
        className="rounded-b-lg shadow-inner"
      >
        {Row}
      </List>
    </div>
  );
};

export default ParcelsTable;
