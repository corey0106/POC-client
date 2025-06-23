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

export const getTop50Parcels = (parcels) =>
  [...parcels]
    .sort((a, b) => {
      const investDiff = (b.investmentScore ?? 0) - (a.investmentScore ?? 0);
      if (investDiff !== 0) return investDiff;
      return (b.zoningFitScore ?? 0) - (a.zoningFitScore ?? 0);
    })
    .slice(0, 50);

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