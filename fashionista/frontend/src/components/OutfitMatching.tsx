import React, { useState, useEffect } from 'react';
import { Outfit, MatchingAnalysis } from '../types/fashion';
import { fetchOutfits, computeOutfitMatching } from '../services/api';
import { Layers, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Palette } from 'lucide-react';

export const OutfitMatching: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [item1, setItem1] = useState<Outfit | null>(null);
  const [item2, setItem2] = useState<Outfit | null>(null);
  const [matchingResult, setMatchingResult] = useState<MatchingAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  useEffect(() => {
    fetchOutfits().then(data => {
      setOutfits(data);
      if (data.length >= 2) {
        setItem1(data[0]);
        setItem2(data[3] || data[1]);
      }
    });
  }, []);

  const handleComputeMatch = async () => {
    if (!item1 || !item2) return;
    setIsCalculating(true);
    const result = await computeOutfitMatching(item1, item2);
    setMatchingResult(result);
    setIsCalculating(false);
  };

  return (
    <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Outfit Synergy & Compatibility Engine</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Outfit <span className="gradient-text">Matching Matrix</span>
        </h2>
        <p className="text-sm text-slate-300">
          Select any two clothing items to compute AI color harmony, texture cohesion, and overall pairing compatibility.
        </p>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Item 1 Selector */}
        <div className="md:col-span-5 glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Primary Garment (Item #1)</h3>
            <span className="text-xs font-bold text-violet-300">{item1?.category}</span>
          </div>

          <div className="relative h-60 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
            {item1 && (
              <img src={item1.image} alt={item1.name} className="w-full h-full object-cover" />
            )}
          </div>

          <select
            value={item1?.id || ''}
            onChange={(e) => {
              const selected = outfits.find(o => o.id === e.target.value);
              if (selected) setItem1(selected);
              setMatchingResult(null);
            }}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            {outfits.map(o => (
              <option key={o.id} value={o.id}>
                {o.name} (${o.price} - {o.category})
              </option>
            ))}
          </select>
        </div>

        {/* Center Versus Indicator & Compute Button */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold font-serif shadow-lg shadow-violet-500/30">
            VS
          </div>
          <button
            onClick={handleComputeMatch}
            disabled={isCalculating || !item1 || !item2}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-violet-600 via-rose-500 to-cyan-500 text-white font-bold text-xs shadow-xl hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Calculate Match</span>
              </>
            )}
          </button>
        </div>

        {/* Item 2 Selector */}
        <div className="md:col-span-5 glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Secondary Garment (Item #2)</h3>
            <span className="text-xs font-bold text-cyan-300">{item2?.category}</span>
          </div>

          <div className="relative h-60 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
            {item2 && (
              <img src={item2.image} alt={item2.name} className="w-full h-full object-cover" />
            )}
          </div>

          <select
            value={item2?.id || ''}
            onChange={(e) => {
              const selected = outfits.find(o => o.id === e.target.value);
              if (selected) setItem2(selected);
              setMatchingResult(null);
            }}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {outfits.map(o => (
              <option key={o.id} value={o.id}>
                {o.name} (${o.price} - {o.category})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Analysis Results Display */}
      {matchingResult && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-4xl mx-auto space-y-6 animate-float">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">AI COMPATIBILITY RATING</span>
              <h3 className="font-serif text-2xl font-bold text-white mt-0.5">{matchingResult.harmony_level}</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-serif text-4xl font-extrabold text-white gradient-text">{matchingResult.compatibility_score}%</div>
                <div className="text-[10px] text-slate-400">Match Score</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="font-semibold text-cyan-300 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>Color Synergy</span>
              </div>
              <p className="text-slate-300">{matchingResult.color_synergy}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="font-semibold text-rose-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Style Cohesion</span>
              </div>
              <p className="text-slate-300">{matchingResult.style_cohesion}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs space-y-1">
            <div className="font-bold text-violet-300">AI Stylist Recommendation</div>
            <p className="text-slate-200 leading-relaxed">{matchingResult.pairing_recommendation}</p>
          </div>

        </div>
      )}

    </section>
  );
};
