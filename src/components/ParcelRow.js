import React from "react";
import { safeFormat } from "../utils/ParcelUtils";

const ParcelRow = ({ index, style, data }) => {
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
      <div className="w-32 text-gray-700 text-center">
        {parcel.highwayDistance && parcel.highwayDistance.distanceMiles !== undefined
          ? parcel.highwayDistance.distanceMiles.toFixed(2)
          : 'N/A'}
      </div>
      <div className="w-32 text-gray-700 text-center">
        {parcel.highwayDistanceScore !== undefined && parcel.highwayDistanceScore !== null
          ? parcel.highwayDistanceScore
          : 'N/A'}
      </div>
      <div className="w-48 truncate text-blue-700 text-center" title={parcel.contactInfo ?? "N/A"}>
        {safeFormat(parcel.contactInfo)}
      </div>
    </div>
  );
};

export default ParcelRow;
