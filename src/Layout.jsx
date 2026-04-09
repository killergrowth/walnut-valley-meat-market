import React, { useState, useEffect } from 'react';
// Metropolis font loaded via @font-face from a CDN
const metropolisStyle = `
  @font-face {
    font-family: 'Metropolis';
    src: url('https://cdn.jsdelivr.net/gh/chrismsimpson/Metropolis@master/Fonts/Metropolis-Black.woff2') format('woff2'),
         url('https://cdn.jsdelivr.net/gh/chrismsimpson/Metropolis@master/Fonts/Metropolis-Black.woff') format('woff');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }
  .font-metropolis-black {
    font-family: 'Metropolis', sans-serif;
    font-weight: 900;
  }
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
  @font-face {
    font-family: 'ChunkFive';
    src: url('https://cdn.jsdelivr.net/npm/@fontsource/chunk-five@4.5.0/files/chunk-five-latin-800-normal.woff2') format('woff2');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }
  .font-chunkfive {
    font-family: 'ChunkFive', serif;
    font-weight: 800;
  }
`;
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X } from 'lucide-react';

const LOGO_DESKTOP = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/5676f74ca_Walnut-Valley-logo1-1-1024x472.png';
const LOGO_MOBILE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/ef6ef9168_WalnutValleyMobileLogo.png';


// Section anchors shown only on the Home page (in desired order)
const homeAnchors = [
  { label: 'Bundles', href: '#bundles' },
  { label: 'Fill Your Freezer', href: '#calculator' },
  { label: 'Locations', href: '#locations' },
  { label: 'Products', href: '#products' },
  { label: 'Our Story', href: '#about' },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = currentPageName === 'Home';
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <style>{metropolisStyle}</style>
      {/* Sitewide Nav */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to={createPageUrl('Home')} onClick={() => { if (isHome) { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>
            <img src={LOGO_DESKTOP} alt="Walnut Valley Meat Market" className="h-12 md:h-16" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to={createPageUrl('Home')}
              className={`px-4 py-2 rounded-full text-base font-bold font-chunkfive transition-colors ${
                currentPageName === 'Home'
                  ? 'bg-red-700 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              Home
            </Link>
            {isHome && (
              <>
                {homeAnchors.map(anchor => (
                  <a
                    key={anchor.href}
                    href={anchor.href}
                    className="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  >
                    {anchor.label}
                  </a>
                ))}
              </>
            )}
            <a
              href="#contact"
              className="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Contact Us
            </a>
          </nav>

          {/* Hamburger (shown below lg breakpoint) */}
          <button
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile/Tablet Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-100 px-4 pb-4">
            <Link
              to={createPageUrl('Home')}
              onClick={() => setMenuOpen(false)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-bold font-chunkfive transition-colors mt-1 ${
                currentPageName === 'Home'
                  ? 'bg-red-700 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              Home
            </Link>
            {isHome && (
              <div className="border-t border-stone-100 mt-2 pt-2">
                <p className="text-xs font-bold text-stone-400 px-4 pb-1 uppercase tracking-wide">Jump To</p>
                {homeAnchors.map(anchor => (
                  <a
                    key={anchor.href}
                    href={anchor.href}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 transition-colors mt-1"
                  >
                    {anchor.label}
                  </a>
                ))}
              </div>
            )}
            <div className="border-t border-stone-100 mt-2 pt-2">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 transition-colors mt-1"
              >
                Contact Us
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}