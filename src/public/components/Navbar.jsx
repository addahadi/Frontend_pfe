import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-white sticky top-0 z-50 shadow-sm">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
          Q
        </div>
        <span className="font-bold text-xl text-slate-900 tracking-tight">
          QuantiConstruct
        </span>
      </div>

      {/* Middle: Navigation Links */}
      <div className="hidden md:flex items-center gap-10 text-slate-600 font-semibold text-sm">
        <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
        <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
        <a href="#articles" className="hover:text-blue-600 transition-colors">Articles</a>
      </div>

      {/* Right Side: Action Button */}
      <div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
          Get Started
        </button>
      </div>

      {/* Mobile Menu Icon (Visible only on small screens) */}
      <div className="md:hidden text-slate-800 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;