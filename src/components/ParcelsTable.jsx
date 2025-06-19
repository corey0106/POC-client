import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import Papa from "papaparse";

const ProgressBar = ({ progress }) => (
  <div className="w-full h-3 bg-gray-200 rounded overflow-hidden mb-4">
    <div
      className="h-full bg-green-500 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const Row = ({ index, style, data }) => {
  const parcel = data[index];

  const safeFormat = (value, type = 'string') => {
    if (value == null) return type === 'string' ? "N/A" : 0;
    if (type === 'number') return value.toFixed(2);
    if (type === 'currency') return value.toLocaleString();
    return value;
  };

  return (
    <div
      style={style}
      className={`flex items-center py-4 border-b border-gray-200
        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
        hover:bg-blue-100 transition-colors duration-200 cursor-pointer select-none`}
    >
      <div className="w-12 text-right pr-4 font-mono text-gray-500 text-center">{index + 1}</div>
      <div className="w-36 truncate font-semibold text-blue-900 text-center" title={parcel.parcelId}>
        {safeFormat(parcel.parcelId)}
      </div>
      <div className="w-52 truncate text-gray-700 text-center" title={parcel.owner}>
        {safeFormat(parcel.owner)}
      </div>
      <div className="w-64 truncate text-gray-600 text-center" title={parcel.address}>
        {safeFormat(parcel.address)}
      </div>
      <div className="w-28 font-mono text-gray-900 text-center">
        {safeFormat(parcel.acreage, 'number')}
      </div>
      <div className="w-24 font-semibold text-indigo-700 text-center">
        {safeFormat(parcel.zoning)}
      </div>
      <div className="w-24 font-semibold text-green-700 text-center">
        {safeFormat(parcel.zoningFitScore, 'number')}
      </div>
      <div className="w-24 font-semibold text-amber-700 text-center">
        {safeFormat(parcel.investmentScore, 'number')}
      </div>
      <div className="w-28 text-gray-700 text-center">{safeFormat(parcel.ownerType)}</div>
      <div className="w-24 text-gray-600 text-center">{safeFormat(parcel.yearsOwned)}</div>
      <div className="w-32 text-gray-700 text-center" title={parcel.zoning_desc}>
        {safeFormat(parcel.zoning_desc)}
      </div>
      <div className="w-32 text-gray-700 text-center">
        <a
          href={`https://www.google.com/maps?q=${parcel.gps.lat},${parcel.gps.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {safeFormat(parcel.gps.lat)} / {safeFormat(parcel.gps.lon)}
        </a>
      </div>
      <div className="w-48 truncate text-blue-700 text-center" title={parcel.contactInfo ?? "N/A"}>
        {safeFormat(parcel.contactInfo)}
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

  const handleHighPotential = () => {
    const high = parcels.filter(
      (p) => (p.zoningFitScore ?? 0) >= 4.5 && (p.investmentScore ?? 0) >= 4.5
    );
    setFilteredParcels(high);
  };

  const handleTop50 = () => {
    const sorted = [...parcels].sort((a, b) => {
      const investDiff = (b.investmentScore ?? 0) - (a.investmentScore ?? 0);
      if (investDiff !== 0) return investDiff;
      return (b.zoningFitScore ?? 0) - (a.zoningFitScore ?? 0);
    });
    setFilteredParcels(sorted.slice(0, 50));
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

            <button onClick={handleHighPotential} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow-md">
              High Potential
            </button>
            <button onClick={handleTop50} className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-semibold shadow-md">
              Top 50 Leads
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
            {Row}
          </List>
        </>
      )}
    </div>
  );
};

export default ParcelsTable;
