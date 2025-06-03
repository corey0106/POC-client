import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏠 My Homepage</h1>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>
      </header>

      <main className="text-center mt-20">
        <h2 className="text-4xl font-semibold text-gray-800">Welcome to the Homepage!</h2>
        <p className="mt-4 text-gray-600">Please log in to continue to your user dashboard.</p>
      </main>
    </div>
  );
};

export default Homepage;
