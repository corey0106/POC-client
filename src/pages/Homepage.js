import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  User,
  HelpCircle,
  Phone,
  LogIn,
} from "lucide-react";
import bgImage from './1.png';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full shadow-xl flex z-50 relative bg-green-500">
        <div className="basis-1/4 flex flex-col justify-center items-center mb-2">
          <h1 className="text-3xl font-bold text-white pt-4">The LandIntel</h1>
          <p className="pt-2 text-xs text-white">Commercial Land Identification & Valuation Engine</p>
          <p className="text-xs text-white">Parcels of United States</p>
        </div>
        
        <div className="basis-1/2 flex justify-center items-center">
          <nav className="space-x-24 flex justify-center items-center">
            <Link to="/" className="flex items-center space-x-2 text-md text-white hover:text-gray-300">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2 text-md text-white hover:text-gray-300">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2 text-md text-white hover:text-gray-300">
              <HelpCircle className="w-5 h-5" />
              <span>Help Center</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2 text-md text-white hover:text-gray-300">
              <Phone className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
          </nav>
        </div>

        <div className="basis-1/4 flex justify-center items-center">
            <Link to="/login" className="flex items-center space-x-2 text-md text-white hover:text-gray-300">
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
        </div>
      </header>

      <main className="text-center flex-grow" style={{ backgroundImage: `url(${bgImage})`}}>
        <h2 className="text-4xl font-semibold text-white pt-20">Welcome to the LandIntel Platform</h2>
        <p className="mt-4 text-white">Please log in to continue to your user dashboard.</p>
        <p className="mt-12 text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">You Can Filter By</p>
        <div className="mt-4 space-y-4">
            <p className="mt-8 text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"> - Zoning Score and Investment Score</p>
            <p className="mt-4 text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"> - Acreage</p>
            <p className="mt-4 text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"> - State, County</p>
            <p className="mt-4 text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"> - And more!</p>
        </div>
      </main>

      <footer className="w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 relative text-white bg-green-500 py-4 text-center">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
