import React from "react";
import Homepage from "./pages/Homepage";
import ParcelsTable from "./components/ParcelsTable";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/parcel-table/:fips" element={<ParcelsTable />} />
      </Routes>
    </Router>
  );
}

export default App;
