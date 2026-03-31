import { Link, Outlet, NavLink } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
      {/* ─── STICKY NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200" data-purpose="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo & Brand */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 no-underline">
              <img src="/logo.png" alt="APEX Logo" className="w-10 h-10 rounded-lg shadow-sm object-cover" />
              <span className="font-bold text-xl tracking-tight text-slate-900 uppercase">APEX</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              <NavLink 
                to="/" 
                className={({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? "text-[#1D4ED8]" : "text-slate-600 hover:text-[#1D4ED8]"}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? "text-[#1D4ED8]" : "text-slate-600 hover:text-[#1D4ED8]"}`}
              >
                About Us
              </NavLink>
              <NavLink 
                to="/articles" 
                className={({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? "text-[#1D4ED8]" : "text-slate-600 hover:text-[#1D4ED8]"}`}
              >
                Articles
              </NavLink>
              <Link 
                to="/auth/register" 
                className="bg-[#1D4ED8] text-white px-7 py-2.5 rounded-md text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle (Simplified) */}
            <div className="md:hidden">
              <button className="text-slate-500" type="button">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── PAGE CONTENT ─── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-black text-white pt-24 pb-12" data-purpose="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <img src="/logo.png" alt="APEX Logo" className="w-10 h-10 rounded-lg object-cover" />
                <span className="font-bold text-2xl tracking-tight uppercase">APEX</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed text-lg">
                The intelligence platform for modern infrastructure. Leading the digital transformation of construction management since 2018.
              </p>
            </div>
            
            <div className="md:col-span-2 md:col-start-7">
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-widest text-white/50">Platform</h4>
              <ul className="space-y-4 text-slate-400 font-medium list-none p-0">
                <li><Link className="hover:text-white transition-colors no-underline" to="/">Home</Link></li>
                <li><Link className="hover:text-white transition-colors no-underline" to="/choose-plan">Pricing & Plans</Link></li>
                <li><Link className="hover:text-white transition-colors no-underline" to="/articles">Articles & News</Link></li>
                <li><Link className="hover:text-white transition-colors no-underline" to="/ai">AI Solutions</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-widest text-white/50">Company</h4>
              <ul className="space-y-4 text-slate-400 font-medium list-none p-0">
                <li><Link className="hover:text-white transition-colors no-underline" to="/about">About Us</Link></li>
                <li><Link className="hover:text-white transition-colors no-underline" to="/support">Contact Support</Link></li>
                <li><Link className="hover:text-white transition-colors no-underline" to="/privacy">Privacy Policy</Link></li>
                <li><Link className="hover:text-white transition-colors no-underline" to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-widest text-white/50">Connect</h4>
              <div className="flex gap-6">
                <a className="text-slate-400 hover:text-white transition-colors" href="#">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                  </svg>
                </a>
                <a className="text-slate-400 hover:text-white transition-colors" href="#">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500 font-medium">© 2026 APEX Inc. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-slate-500 font-medium">
              <Link className="hover:text-white no-underline" to="/privacy">Privacy</Link>
              <Link className="hover:text-white no-underline" to="/cookies">Cookies</Link>
              <Link className="hover:text-white no-underline" to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
