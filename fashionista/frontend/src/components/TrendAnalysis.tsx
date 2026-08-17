import React, { useState, useEffect } from 'react';
import { Trend, ActiveTab } from '../types/fashion';
import { fetchTrends } from '../services/api';
import { TrendingUp, Sparkles, Flame, Eye, ArrowUpRight, BarChart3, Shirt } from 'lucide-react';

interface TrendAnalysisProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ setActiveTab }) => {
  const [trends, setTrends] = useState<Trend[]>([]);

  useEffect(() => {
    fetchTrends().then(data => setTrends(data));
  }, []);

  return (
    <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Runway & Social Trend Analytics</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Fashion <span className="gradient-text">Trend Radar</span>
        </h2>
        <p className="text-sm text-slate-300">
          AI insights tracking global runway collections, street style momentum, and monthly search growth velocity.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RUNWAY MOMENTUM</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-white gradient-text">+38% YoY</div>
          <p className="text-xs text-slate-300">Increased demand for structured tailoring & quiet luxury.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>COLOR VELOCITY</span>
            <BarChart3 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-white gradient-text">Monochrome</div>
          <p className="text-xs text-slate-300">Neutral tones (Camel, Oat, Espresso) dominate SS26 collections.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI CONFIDENCE</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-white gradient-text">96.4%</div>
          <p className="text-xs text-slate-300">Trend velocity prediction accuracy based on fashion NLP signals.</p>
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span>Top Trending Aesthetics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trends.map(trend => (
            <div
              key={trend.id}
              className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-5 hover:border-violet-500/40 transition-all group"
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{trend.growth} Growth</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{trend.sentiment}</span>
                </div>

                <h4 className="font-serif text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                  {trend.name}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {trend.description}
                </p>

                {/* Color Palette */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Core Trend Palette:</span>
                  <div className="flex items-center gap-2">
                    {trend.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => setActiveTab('try-on')}
                className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-violet-600 text-white font-semibold text-xs border border-white/10 hover:border-transparent flex items-center justify-center gap-2 transition-all"
              >
                <Shirt className="w-4 h-4 text-cyan-300" />
                <span>Try This Trend in Studio</span>
              </button>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
