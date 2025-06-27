import Papa from "papaparse";

export function safeFormat(value, type = "text") {
  if (value === null || value === undefined) return "—";
  if (type === "number" && typeof value === "number") {
    return value.toFixed(2);
  }
  return value.toString();
}

export const filterParcels = (parcels, minZoning, maxZoning, minAcreage, maxAcreage) => {
  return parcels.filter((parcel) => {
    const zoningScore = parcel.zoningFitScore;
    const acreage = parcel.acreage;
    const zoningScoreValid =
      (minZoning === "" || zoningScore >= Number(minZoning)) &&
      (maxZoning === "" || zoningScore <= Number(maxZoning));
    const acreageValid =
      (minAcreage === "" || acreage >= Number(minAcreage)) &&
      (maxAcreage === "" || acreage <= Number(maxAcreage));
    return zoningScoreValid && acreageValid;
  });
};

export const getHighPotentialParcels = (parcels) =>
  parcels.filter(
    (p) => (p.zoningFitScore ?? 0) >= 4.5 && (p.investmentScore ?? 0) >= 4.5
  );

export const getTop50Parcels = (parcels) => {
  // Separate industrial parcels (HI, LI, M-1) from other zoning types
  const industrialParcels = parcels.filter(p => 
    p.zoning === 'HI' || p.zoning === 'LI' || p.zoning === 'M-1'
  );
  const otherParcels = parcels.filter(p => 
    p.zoning !== 'HI' && p.zoning !== 'LI' && p.zoning !== 'M-1'
  );

  // Sort industrial parcels by distance to highway (smallest to largest)
  // This prioritizes industrial parcels that are closer to highways
  const sortedIndustrialParcels = [...industrialParcels]
    .sort((a, b) => {
      const aDistance = a.highwayDistance?.distanceMiles ?? Infinity;
      const bDistance = b.highwayDistance?.distanceMiles ?? Infinity;
      
      // If both have no distance data, fall back to investment score
      if (aDistance === Infinity && bDistance === Infinity) {
        const investDiff = (b.investmentScore ?? 0) - (a.investmentScore ?? 0);
        if (investDiff !== 0) return investDiff;
        return (b.zoningFitScore ?? 0) - (a.zoningFitScore ?? 0);
      }
      
      // If only one has distance data, prioritize the one with data
      if (aDistance === Infinity) return 1;
      if (bDistance === Infinity) return -1;
      
      return aDistance - bDistance;
    });

  // Sort other parcels by the original criteria (investment score, then zoning score)
  const sortedOtherParcels = [...otherParcels]
    .sort((a, b) => {
      const investDiff = (b.investmentScore ?? 0) - (a.investmentScore ?? 0);
      if (investDiff !== 0) return investDiff;
      return (b.zoningFitScore ?? 0) - (a.zoningFitScore ?? 0);
    });

  // Combine and take top 50, prioritizing industrial parcels first
  // This ensures industrial parcels appear at the top of the list
  const combinedParcels = [...sortedIndustrialParcels, ...sortedOtherParcels];
  return combinedParcels.slice(0, 50);
};

export const exportParcelsToCSV = (parcels) => {
  const csv = Papa.unparse(parcels);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "parcels_filtered.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};