import React from "react";

const ProgressBar = ({ progress }) => (
  <div className="w-full h-3 bg-gray-200 rounded overflow-hidden mb-4">
    <div
      className="h-full bg-green-500 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default ProgressBar;
