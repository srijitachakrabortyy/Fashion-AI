import React from 'react';
import { ActiveTab } from '../types/fashion';
import { Camera, Sparkles, Layers, TrendingUp, ArrowRight } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-12 lg:pt-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & Action Buttons */}
          <div className="lg:col-span-6 space-y-8 text-left z-10">
            
            {/* Top Pill Badge */}
            <div className="inline-block px-3.5 py-1.5 rounded text-[11px] font-mono tracking-[0.2em] font-semibold text-[#E5B869] border border-[#E5B869]/40 bg-[#E5B869]/5">
              AI-POWERED FASHION
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Your Style, <br />
              <span className="italic font-serif text-[#E5B869] font-normal">Reimagined</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 max-w-lg font-sans font-light leading-relaxed">
              Experience the future of fashion with AI-driven virtual try-ons, personalized styling, and real-time trend intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('try-on')}
                className="gold-btn px-7 py-3.5 rounded-md text-xs tracking-wider font-semibold flex items-center gap-2"
              >
                <span>Try It Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('recommendations')}
                className="px-7 py-3.5 rounded-md border border-white/15 text-xs tracking-wider font-semibold text-white hover:border-[#E5B869]/50 hover:text-[#E5B869] transition-all bg-white/5"
              >
                Learn More
              </button>
            </div>

          </div>

          {/* Right Column: Hero High Fashion Image Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-900/30 group">
              
              {/* Main Model Image */}
              <div className="relative h-[520px] sm:h-[580px] w-full bg-[#12100E] overflow-hidden">
                <img
                  src="/outfit_gold_dress.jpg"
                  alt="FashionAI Editorial Model"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Style Match Badge Card */}
                <div className="absolute top-8 right-8 glass-card-gold p-4 rounded-xl border border-[#E5B869]/30 min-w-[200px] shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between text-[10px] tracking-widest text-slate-400 font-mono">
                    <span>STYLE MATCH</span>
                    <Sparkles className="w-4 h-4 text-[#E5B869]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#E5B869] mt-1">
                    97<span className="text-xl">%</span>
                  </div>
                </div>

                {/* Soft gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: FEATURES ("Intelligence Meets Elegance") */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-12 pt-8">
        
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] font-semibold text-[#E5B869]">
            FEATURES
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Intelligence Meets <span className="italic font-serif text-[#E5B869] font-normal">Elegance</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Virtual Try-On */}
          <div 
            onClick={() => setActiveTab('try-on')}
            className="glass-card-gold p-8 rounded-2xl border border-white/10 text-left space-y-4 cursor-pointer group hover:border-[#E5B869]/40"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#E5B869]/20 flex items-center justify-center text-[#E5B869] group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5B869] transition-colors">
              Virtual Try-On
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Upload your photo and visualize outfits on yourself with photorealistic AI rendering.
            </p>
          </div>

          {/* Card 2: Style Recommendations */}
          <div 
            onClick={() => setActiveTab('recommendations')}
            className="glass-card-gold p-8 rounded-2xl border border-white/10 text-left space-y-4 cursor-pointer group hover:border-[#E5B869]/40"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#E5B869]/20 flex items-center justify-center text-[#E5B869] group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5B869] transition-colors">
              Style Recommendations
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Receive curated outfit suggestions tailored to your body type, preferences, and occasions.
            </p>
          </div>

          {/* Card 3: Outfit Matching */}
          <div 
            onClick={() => setActiveTab('matching')}
            className="glass-card-gold p-8 rounded-2xl border border-white/10 text-left space-y-4 cursor-pointer group hover:border-[#E5B869]/40"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#E5B869]/20 flex items-center justify-center text-[#E5B869] group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5B869] transition-colors">
              Outfit Matching
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              AI-powered compatibility scoring ensures every piece works together flawlessly.
            </p>
          </div>

          {/* Card 4: Trend Analysis */}
          <div 
            onClick={() => setActiveTab('trends')}
            className="glass-card-gold p-8 rounded-2xl border border-white/10 text-left space-y-4 cursor-pointer group hover:border-[#E5B869]/40"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#E5B869]/20 flex items-center justify-center text-[#E5B869] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5B869] transition-colors">
              Trend Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Stay ahead with real-time fashion trend insights from runways and street style worldwide.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION 3: TREND BANNER ("Stay Ahead of Every Trend") */}
      <section className="px-6 lg:px-12 max-w-5xl mx-auto text-center space-y-6 pt-12">
        <div className="text-[11px] font-mono tracking-[0.2em] font-semibold text-[#E5B869]">
          TREND ANALYSIS
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Stay Ahead of <span className="italic font-serif text-[#E5B869] font-normal">Every Trend</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Our AI continuously analyzes global fashion weeks, street style, and social media to bring you real-time trend intelligence and personalized recommendations.
        </p>

        <div className="pt-4">
          <button
            onClick={() => setActiveTab('trends')}
            className="gold-btn px-8 py-4 rounded-md text-xs tracking-wider font-semibold inline-flex items-center gap-2 shadow-xl shadow-amber-900/20"
          >
            <span>Explore Trends</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
