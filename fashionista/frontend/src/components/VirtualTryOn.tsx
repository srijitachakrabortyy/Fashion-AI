import React, { useState, useEffect } from 'react';
import { Outfit, TryOnResult } from '../types/fashion';
import { fetchOutfits, processVirtualTryOn } from '../services/api';
import { Upload, Shirt, Sparkles, CheckCircle2, RefreshCw, BookmarkPlus, User, Sliders, Camera } from 'lucide-react';
import { CameraStudio } from './CameraStudio';

interface VirtualTryOnProps {
  onSaveToCloset: (result: TryOnResult) => void;
}

const PRESET_AVATARS = [
  { id: 'p1', name: 'Gold Editorial', gender: 'Women', image: '/outfit_gold_dress.jpg' },
  { id: 'p2', name: 'Obsidian Male', gender: 'Men', image: '/hero_model_gold.jpg' },
  { id: 'p3', name: 'Haute Model', gender: 'Women', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' }
];

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ onSaveToCloset }) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  
  const [userPhoto, setUserPhoto] = useState<string>(PRESET_AVATARS[0].image);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showCameraStudio, setShowCameraStudio] = useState<boolean>(false);

  useEffect(() => {
    fetchOutfits(selectedCategory).then(data => {
      setOutfits(data);
      if (data.length > 0 && !selectedOutfit) {
        setSelectedOutfit(data[0]);
      }
    });
  }, [selectedCategory]);

  const runTryOnWithPhoto = async (photoToUse: string, outfitToUse?: Outfit | null) => {
    const targetOutfit = outfitToUse !== undefined ? outfitToUse : selectedOutfit;
    if (!targetOutfit) return;
    
    setIsProcessing(true);
    setTryOnResult(null);

    const steps = [
      'Detecting body posture & silhouette coordinates...',
      'Mapping 3D garment mesh & gold embroidery overlay...',
      'Applying lighting & shadow homogenization...',
      'Synthesizing photorealistic Computer Vision try-on...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(r => setTimeout(r, 450));
    }

    const result = await processVirtualTryOn(photoToUse, targetOutfit);
    setTryOnResult(result);
    setIsProcessing(false);
    setSavedSuccess(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        setUserPhoto(photoData);
        runTryOnWithPhoto(photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTryOn = async () => {
    runTryOnWithPhoto(userPhoto, selectedOutfit);
  };

  const handleSaveLook = () => {
    if (tryOnResult) {
      onSaveToCloset(tryOnResult);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-[11px] font-mono tracking-[0.2em] font-semibold text-[#E5B869]">
          COMPUTER VISION FITTING STUDIO
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Virtual <span className="italic font-serif text-[#E5B869] font-normal">Try-On</span> Studio
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light">
          Capture via live OpenCV webcam, upload your photo, or pick a sample avatar to experience photorealistic AI garment blending.
        </p>
      </div>

      {/* Live OpenCV Camera Studio Modal / Banner */}
      {showCameraStudio && (
        <div className="max-w-5xl mx-auto animate-fadeIn">
          <CameraStudio
            onCapture={(captured) => {
              setUserPhoto(captured);
              setShowCameraStudio(false);
              runTryOnWithPhoto(captured);
            }}
            onClose={() => setShowCameraStudio(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Photo Upload & Avatar Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card-gold rounded-2xl p-6 border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#E5B869]" />
                <span>1. User Photo</span>
              </h3>
              <span className="text-[10px] text-slate-400">Webcam / JPG / PNG</span>
            </div>

            {/* Live Camera Button */}
            <button
              onClick={() => setShowCameraStudio(!showCameraStudio)}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md border ${
                showCameraStudio
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-[#E5B869]/10 hover:bg-[#E5B869]/20 text-[#E5B869] border-[#E5B869]/40 hover:border-[#E5B869]'
              }`}
            >
              <Camera className="w-4 h-4 text-[#E5B869]" />
              <span>{showCameraStudio ? 'Close Live OpenCV Camera' : '📷 Open Live OpenCV Camera'}</span>
            </button>

            <div className="relative h-[250px] rounded-xl overflow-hidden bg-[#0A0908] border border-white/10 group">
              <img
                src={userPhoto}
                alt="User photo"
                className="w-full h-full object-cover object-top"
              />
              <label className="absolute inset-0 bg-[#0A0908]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer text-white">
                <Upload className="w-6 h-6 text-[#E5B869]" />
                <span className="text-xs font-semibold">Upload Photo File</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">Sample Avatars:</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => {
                      setUserPhoto(avatar.image);
                      runTryOnWithPhoto(avatar.image);
                    }}
                    className={`relative rounded-lg overflow-hidden border transition-all h-20 ${
                      userPhoto === avatar.image
                        ? 'border-[#E5B869] ring-2 ring-[#E5B869]/40'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover object-top" />
                    <span className="absolute bottom-0 inset-x-0 bg-[#0A0908]/90 text-[9px] font-semibold text-[#E5B869] py-0.5 text-center truncate">
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Center Column: Garment Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card-gold rounded-2xl p-6 border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Shirt className="w-4 h-4 text-[#E5B869]" />
                <span>2. Select Garment</span>
              </h3>
              <span className="text-xs font-bold text-[#E5B869]">{outfits.length} Items</span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Evening', 'Formal', 'Casual', 'Streetwear'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#E5B869] text-[#0A0908] font-bold shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Outfit Items Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {outfits.map((outfit) => {
                const isSelected = selectedOutfit?.id === outfit.id;
                return (
                  <div
                    key={outfit.id}
                    onClick={() => {
                      setSelectedOutfit(outfit);
                      runTryOnWithPhoto(userPhoto, outfit);
                    }}
                    className={`group relative rounded-xl overflow-hidden border p-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#E5B869] bg-[#E5B869]/10 ring-2 ring-[#E5B869]/30'
                        : 'border-white/10 bg-[#0A0908]/40 hover:border-white/30'
                    }`}
                  >
                    <div className="relative h-32 rounded-lg overflow-hidden mb-2 bg-[#0A0908]">
                      <img src={outfit.image} alt={outfit.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" />
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#0A0908]/90 text-[#E5B869] border border-[#E5B869]/30">
                        {outfit.compatibility_score}% Match
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-white truncate">{outfit.name}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{outfit.category}</span>
                        <span className="font-bold text-[#E5B869]">${outfit.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRunTryOn}
              disabled={isProcessing || !selectedOutfit}
              className="gold-btn w-full py-3.5 rounded-lg text-xs tracking-wider font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0A0908]" />
                  <span>Processing Virtual Fit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0A0908]" />
                  <span>Run Computer Vision Fitting</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: AI Try-On Canvas & Fit Analytics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card-gold rounded-2xl p-6 border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#E5B869]" />
                <span>3. Try-On Preview</span>
              </h3>
              {tryOnResult && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E5B869]/20 text-[#E5B869] border border-[#E5B869]/30 rounded">
                  Synthesized Fit
                </span>
              )}
            </div>

            <div className="relative h-[340px] rounded-xl overflow-hidden bg-[#0A0908] border border-white/10 flex items-center justify-center">
              {isProcessing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#0A0908]/90 z-20">
                  <RefreshCw className="w-10 h-10 text-[#E5B869] animate-spin" />
                  <p className="text-xs font-mono text-[#E5B869] tracking-wide animate-pulse">
                    {processingStep}
                  </p>
                </div>
              ) : tryOnResult ? (
                <div className="relative w-full h-full">
                  <img
                    src={tryOnResult.try_on_image}
                    alt="Synthesized Try-On"
                    className="w-full h-full object-cover object-top"
                  />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-card-gold border border-[#E5B869]/40 text-[#E5B869] text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tryOnResult.fit_analytics.overall_match_score}% Fit Score</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3 text-slate-500">
                  <Shirt className="w-12 h-12 mx-auto text-slate-700 opacity-60" />
                  <p className="text-xs text-slate-400 font-light">Select a garment and click "Run Computer Vision Fitting" to generate preview.</p>
                </div>
              )}
            </div>

            {tryOnResult && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0A0908] border border-white/5">
                    <div className="text-[10px] text-slate-400">Shoulder Alignment</div>
                    <div className="font-bold text-[#E5B869] mt-0.5">{tryOnResult.fit_analytics.shoulder_alignment}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0A0908] border border-white/5">
                    <div className="text-[10px] text-slate-400">Waist Contour Fit</div>
                    <div className="font-bold text-[#E5B869] mt-0.5">{tryOnResult.fit_analytics.waist_contour_fit}</div>
                  </div>
                </div>

                <button
                  onClick={handleSaveLook}
                  disabled={savedSuccess}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    savedSuccess
                      ? 'bg-[#E5B869] text-[#0A0908]'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{savedSuccess ? 'Saved to Closet!' : 'Save Look to Closet'}</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
