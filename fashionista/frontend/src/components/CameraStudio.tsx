import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Eye, Scan, X, RotateCcw, Sparkles } from 'lucide-react';
import { CameraAnalysis } from '../types/fashion';
import { analyzeCameraFrame } from '../services/api';

interface CameraStudioProps {
  onCapture: (photoBase64: string) => void;
  onClose?: () => void;
}

export const CameraStudio: React.FC<CameraStudioProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [openCVAnalysis, setOpenCVAnalysis] = useState<CameraAnalysis | null>(null);
  const [showOpenCVAnnotated, setShowOpenCVAnnotated] = useState<boolean>(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to access camera. Please check browser permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleTakeSnapshot = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedPhoto(dataUrl);
        runOpenCVDiagnostic(dataUrl);
      }
    } else {
      // Fallback simulated camera snap if camera is not connected
      simulateFallbackSnap();
    }
  };

  const simulateFallbackSnap = () => {
    // Generate a gold luxury dummy portrait for OpenCV processing
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0A0908';
      ctx.fillRect(0, 0, 600, 800);
      
      // Draw silhouette oval
      ctx.strokeStyle = '#E5B869';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(300, 320, 140, 190, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#E5B86920';
      ctx.fill();

      // Draw shoulders
      ctx.beginPath();
      ctx.moveTo(100, 700);
      ctx.quadraticCurveTo(300, 480, 500, 700);
      ctx.stroke();

      ctx.fillStyle = '#E5B869';
      ctx.font = '16px monospace';
      ctx.fillText('OPENCV LIVE CAMERA SNAP', 180, 760);

      const fallbackUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(fallbackUrl);
      runOpenCVDiagnostic(fallbackUrl);
    }
  };

  const runOpenCVDiagnostic = async (photoUrl: string) => {
    setIsAnalyzing(true);
    setOpenCVAnalysis(null);
    try {
      const analysis = await analyzeCameraFrame(photoUrl);
      setOpenCVAnalysis(analysis);
    } catch (e) {
      console.error('OpenCV analysis error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      if (onClose) onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="glass-card-gold rounded-2xl p-6 border border-[#E5B869]/30 bg-[#0A0908]/95 text-white space-y-6 relative overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/30 text-[#E5B869]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span>Live OpenCV Camera Studio</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#E5B869]/20 text-[#E5B869] border border-[#E5B869]/40 uppercase">
                OpenCV Connected
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Align posture inside the gold silhouette outline for real-time computer vision fitting.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Main Section: Camera Feed / Snapshot View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-white/10 aspect-[4/3] flex items-center justify-center group shadow-inner">
            
            {/* Live Camera Stream */}
            {!capturedPhoto ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Live Pose Silhouette Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  {/* Head Oval Overlay */}
                  <div className="w-48 h-64 border-2 border-dashed border-[#E5B869]/60 rounded-full flex flex-col items-center justify-center relative animate-pulse">
                    <div className="absolute top-3 text-[10px] font-mono tracking-widest text-[#E5B869] font-bold bg-[#0A0908]/80 px-2 py-0.5 rounded">
                      FACE & HEAD
                    </div>
                  </div>

                  {/* Shoulder Arc */}
                  <div className="w-80 h-32 border-t-2 border-dashed border-[#E5B869]/40 rounded-t-full mt-2 relative">
                    <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-mono tracking-widest text-[#E5B869]/70 uppercase">
                      Shoulder Fit Line
                    </div>
                  </div>

                  {/* Crosshair indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-full h-[1px] bg-[#E5B869]" />
                    <div className="h-full w-[1px] bg-[#E5B869] absolute" />
                  </div>
                </div>

                {/* Telemetry Status Bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#E5B869] bg-[#0A0908]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E5B869]/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{isCameraActive ? 'LIVE WEBCAM STREAMING' : 'CAMERA READY'}</span>
                  </div>
                  <div className="text-slate-300">
                    {facingMode === 'user' ? 'Front Camera' : 'Environment Camera'}
                  </div>
                </div>
              </>
            ) : (
              /* Captured Frame View */
              <div className="relative w-full h-full">
                <img
                  src={showOpenCVAnnotated && openCVAnalysis?.annotated_photo ? openCVAnalysis.annotated_photo : capturedPhoto}
                  alt="Captured Frame"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#0A0908]/90 border border-[#E5B869]/40 text-[#E5B869] text-xs font-bold font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{showOpenCVAnnotated ? 'OpenCV Annotated Telemetry' : 'Snapshot Frame Captured'}</span>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {cameraError && !capturedPhoto && (
              <div className="absolute inset-0 bg-[#0A0908]/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
                <AlertCircle className="w-10 h-10 text-amber-500" />
                <p className="text-xs text-slate-300 max-w-sm">{cameraError}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-lg bg-[#E5B869] text-[#0A0908] text-xs font-bold hover:bg-[#d4a758]"
                  >
                    Retry Camera Access
                  </button>
                  <button
                    onClick={simulateFallbackSnap}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 border border-white/10"
                  >
                    Simulate Snap
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {!capturedPhoto ? (
              <>
                <button
                  onClick={toggleFacingMode}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 border border-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Flip Camera</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={simulateFallbackSnap}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 border border-white/10"
                  >
                    <span>Test Snapshot</span>
                  </button>
                  
                  <button
                    onClick={handleTakeSnapshot}
                    className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-[#0A0908]" />
                    <span>Capture Fit Snapshot</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCapturedPhoto(null);
                    setOpenCVAnalysis(null);
                    setShowOpenCVAnnotated(false);
                    startCamera();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-2 border border-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>

                {openCVAnalysis?.annotated_photo && (
                  <button
                    onClick={() => setShowOpenCVAnnotated(!showOpenCVAnnotated)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                      showOpenCVAnnotated
                        ? 'bg-[#E5B869] text-[#0A0908] border-[#E5B869]'
                        : 'bg-white/5 text-[#E5B869] border-[#E5B869]/30 hover:bg-[#E5B869]/10'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showOpenCVAnnotated ? 'Original View' : 'OpenCV Overlay'}</span>
                  </button>
                )}

                <button
                  onClick={handleApplyPhoto}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-[#0A0908]" />
                  <span>Use Photo for Virtual Fit</span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* Right Section: OpenCV Computer Vision Diagnostic Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0A0908] border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-[#E5B869]" />
                <span>OpenCV Telemetry Diagnostic</span>
              </h4>
              {isAnalyzing && (
                <RefreshCw className="w-4 h-4 text-[#E5B869] animate-spin" />
              )}
            </div>

            {openCVAnalysis ? (
              <div className="space-y-3 text-xs">
                
                {/* Sharpness metric */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>OpenCV Laplacian Sharpness</span>
                    <span className="font-mono font-bold text-[#E5B869]">
                      {openCVAnalysis.opencv_laplacian_sharpness}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400">
                    ✓ {openCVAnalysis.sharpness_rating}
                  </div>
                </div>

                {/* LAB Luminance metric */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>OpenCV LAB Luminance Profile</span>
                    <span className="font-mono font-bold text-slate-200">
                      {openCVAnalysis.opencv_lab_luminance} (±{openCVAnalysis.luminance_stddev})
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#E5B869] h-full rounded-full"
                      style={{ width: `${Math.min(100, (openCVAnalysis.opencv_lab_luminance / 255) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Posture & Contours metric */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Body Bounding Box</div>
                    <div className="text-[#E5B869] font-bold mt-0.5 truncate">
                      {openCVAnalysis.opencv_body_bbox.w}x{openCVAnalysis.opencv_body_bbox.h} px
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Contours Detected</div>
                    <div className="text-[#E5B869] font-bold mt-0.5">
                      {openCVAnalysis.opencv_detected_contours} OpenCV Contours
                    </div>
                  </div>
                </div>

                {/* Posture recommendation status */}
                {openCVAnalysis.posture_alignment && (
                  <div className="p-3 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/30 text-[#E5B869] space-y-1">
                    <div className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                      Postural Alignment Feedback
                    </div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{openCVAnalysis.posture_alignment}</span>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-8 text-center space-y-2 text-slate-500 text-xs">
                <Camera className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                <p>Click "Capture Fit Snapshot" to run real-time OpenCV Laplacian sharpness & pose analysis.</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
