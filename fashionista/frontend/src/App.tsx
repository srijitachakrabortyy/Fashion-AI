import React, { useState, useEffect } from 'react';
import { ActiveTab, TryOnResult } from './types/fashion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VirtualTryOn } from './components/VirtualTryOn';
import { StyleRecommendations } from './components/StyleRecommendations';
import { OutfitMatching } from './components/OutfitMatching';
import { TrendAnalysis } from './components/TrendAnalysis';
import { SavedCloset } from './components/SavedCloset';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [savedLooks, setSavedLooks] = useState<TryOnResult[]>(() => {
    try {
      const stored = localStorage.getItem('fashionai_saved_looks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fashionai_saved_looks', JSON.stringify(savedLooks));
    } catch (e) {
      console.error('Failed to sync saved looks to localStorage:', e);
    }
  }, [savedLooks]);

  const handleSaveToCloset = (result: TryOnResult) => {
    setSavedLooks(prev => [result, ...prev]);
  };

  const handleRemoveFromCloset = (index: number) => {
    setSavedLooks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0A0908] text-slate-100 selection:bg-[#E5B869] selection:text-[#0A0908]">
      
      {/* Top Glass Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedLooks.length}
      />

      {/* Main View Container */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <Hero setActiveTab={setActiveTab} />
        )}

        {activeTab === 'try-on' && (
          <VirtualTryOn onSaveToCloset={handleSaveToCloset} />
        )}

        {activeTab === 'recommendations' && (
          <StyleRecommendations setActiveTab={setActiveTab} />
        )}

        {activeTab === 'matching' && (
          <OutfitMatching />
        )}

        {activeTab === 'trends' && (
          <TrendAnalysis setActiveTab={setActiveTab} />
        )}

        {activeTab === 'closet' && (
          <SavedCloset
            savedLooks={savedLooks}
            onRemoveLook={handleRemoveFromCloset}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Luxury Minimalist Footer Matching Screenshot */}
      <footer className="bg-[#0A0908] border-t border-white/10 py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#E5B869]">
              FashionAI
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8 font-medium">
            <button onClick={() => setActiveTab('try-on')} className="hover:text-[#E5B869] transition-colors">Try-On</button>
            <button onClick={() => setActiveTab('recommendations')} className="hover:text-[#E5B869] transition-colors">Style</button>
            <button onClick={() => setActiveTab('trends')} className="hover:text-[#E5B869] transition-colors">Trends</button>
            <button onClick={() => setActiveTab('matching')} className="hover:text-[#E5B869] transition-colors">Matching</button>
          </div>

          {/* Copyright */}
          <div className="text-slate-500 font-sans text-[11px]">
            © {new Date().getFullYear()} FashionAI. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
};

export default App;
