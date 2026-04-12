import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl">Q</div>
            <span className="font-bold text-xl">QuantiConstruct</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Leading the digital transformation of construction management. Our tools empower projects worldwide for better estimation and faster delivery.
          </p>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-blue-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Pricing & Plans</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Articles & News</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">AI Solutions</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-blue-500 transition">About Us</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Contact Support</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-bold mb-6">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-blue-600 transition">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-blue-600 transition">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-xs">© 2026 QuantiConstruct Inc. All rights reserved.</p>
        <div className="flex gap-6 text-slate-500 text-xs">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;