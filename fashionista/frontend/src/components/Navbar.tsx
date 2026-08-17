import React from 'react';
import { ActiveTab } from '../types/fashion';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0908]/90 backdrop-blur-md border-b border-white/5 px-6 lg:px-12 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-[#E5B869] hover:text-[#F0C87A] transition-colors">
            FashionAI
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider text-slate-300 font-medium">
          <button
            onClick={() => setActiveTab('try-on')}
            className={`hover:text-[#E5B869] transition-colors ${activeTab === 'try-on' ? 'text-[#E5B869] font-bold' : ''}`}
          >
            Try-On
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`hover:text-[#E5B869] transition-colors ${activeTab === 'recommendations' ? 'text-[#E5B869] font-bold' : ''}`}
          >
            Style
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`hover:text-[#E5B869] transition-colors ${activeTab === 'trends' ? 'text-[#E5B869] font-bold' : ''}`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`hover:text-[#E5B869] transition-colors ${activeTab === 'matching' ? 'text-[#E5B869] font-bold' : ''}`}
          >
            Matching
          </button>
          <button
            onClick={() => setActiveTab('closet')}
            className={`hover:text-[#E5B869] transition-colors flex items-center gap-1.5 ${activeTab === 'closet' ? 'text-[#E5B869] font-bold' : ''}`}
          >
            <span>Closet</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 text-[10px] font-bold bg-[#E5B869] text-[#0A0908] rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Primary CTA Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('try-on')}
            className="gold-btn px-6 py-2.5 rounded-lg text-xs tracking-wider font-semibold"
          >
            Get Started
          </button>
        </div>

      </div>

      {/* Mobile Bar */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-2 border-t border-white/5 text-xs text-slate-300">
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-[#E5B869]' : ''}>Home</button>
        <button onClick={() => setActiveTab('try-on')} className={activeTab === 'try-on' ? 'text-[#E5B869]' : ''}>Try-On</button>
        <button onClick={() => setActiveTab('recommendations')} className={activeTab === 'recommendations' ? 'text-[#E5B869]' : ''}>Style</button>
        <button onClick={() => setActiveTab('trends')} className={activeTab === 'trends' ? 'text-[#E5B869]' : ''}>Trends</button>
        <button onClick={() => setActiveTab('closet')} className={activeTab === 'closet' ? 'text-[#E5B869]' : ''}>Closet</button>
      </div>
    </header>
  );
};
