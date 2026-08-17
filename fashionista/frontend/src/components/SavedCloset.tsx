import React from 'react';
import { TryOnResult, ActiveTab } from '../types/fashion';
import { Heart, Shirt, Download, Trash2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface SavedClosetProps {
  savedLooks: TryOnResult[];
  onRemoveLook: (index: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SavedCloset: React.FC<SavedClosetProps> = ({ savedLooks, onRemoveLook, setActiveTab }) => {
  return (
    <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-rose-500/30 text-xs font-semibold text-rose-300">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Personal Virtual Wardrobe</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Saved <span className="gradient-text">Try-On Closet</span>
        </h2>
        <p className="text-sm text-slate-300">
          Your personal collection of virtual try-on creations, fit analytics, and saved style pairings.
        </p>
      </div>

      {savedLooks.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 border border-white/10">
          <Shirt className="w-16 h-16 mx-auto text-slate-600 opacity-60" />
          <h3 className="font-serif text-xl font-bold text-white">Your closet is empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't saved any virtual try-on results yet. Launch the Virtual Fitting Studio to create your first look!
          </p>
          <button
            onClick={() => setActiveTab('try-on')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-rose-500 text-white font-semibold text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-violet-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create First Virtual Fit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLooks.map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-72 bg-slate-950 overflow-hidden">
                  <img
                    src={item.try_on_image}
                    alt={item.outfit?.name || 'Virtual Look'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-panel border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.fit_analytics.overall_match_score}% Fit</span>
                  </div>

                  <button
                    onClick={() => onRemoveLook(index)}
                    className="absolute top-3 right-3 p-2 rounded-full glass-panel text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all border border-rose-500/30"
                    title="Remove from closet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.outfit?.category || 'Garment'}</span>
                    <span>Size: {item.fit_analytics.recommended_size}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white">
                    {item.outfit?.name || 'Synthesized Fit'}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.fit_analytics.style_notes}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={item.try_on_image}
                  download={`fashion-ai-fit-${index + 1}.png`}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-cyan-300" />
                  <span>Download High-Res Image</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
