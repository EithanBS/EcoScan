import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Droplets, AlertTriangle, Loader2, X, ArrowRight, Activity } from 'lucide-react';
import { analyzeWater } from '../../services/helixmind';
import { cn } from '../../lib/utils';

export const HydroScan = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeWater(image);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hydro-cyan-light/10 text-hydro-cyan-dark text-[10px] font-display font-bold uppercase tracking-[0.2em] mb-4 border border-hydro-cyan-light/20">
          <Droplets size={14} className="text-hydro-cyan" /> Water Quality Analysis
        </div>
        <h2 className="text-4xl font-serif mb-4 bg-gradient-to-br from-hydro-blue-dark to-hydro-blue bg-clip-text text-transparent">HydroScan Analysis</h2>
        <p className="text-hydro-blue/60 max-w-xl mx-auto">
          Upload an image of a water body to detect visual indicators of quality risks, 
          including turbidity, algal blooms, and pollution.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {!image ? (
            <div 
              {...getRootProps()} 
              className={cn(
                "aspect-square rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center p-12 transition-all cursor-pointer",
                isDragActive ? "border-hydro-cyan bg-hydro-cyan/5" : "border-hydro-sand/20 hover:border-hydro-cyan/40 hover:bg-hydro-cream"
              )}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-gradient-to-br from-hydro-cyan/10 to-hydro-cyan-light/10 rounded-full flex items-center justify-center text-hydro-cyan mb-6 shadow-inner">
                <Upload size={32} />
              </div>
              <p className="text-lg font-medium text-hydro-blue mb-2">Drop your image here</p>
              <p className="text-sm text-hydro-blue/50">or click to browse files</p>
            </div>
          ) : (
            <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl group">
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
              <button 
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
              {!result && !analyzing && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handleAnalyze}
                    className="px-8 py-3 bg-white text-hydro-blue rounded-2xl font-medium shadow-xl hover:scale-105 transition-transform"
                  >
                    Start Analysis
                  </button>
                </div>
              )}
            </div>
          )}

          {image && !result && !analyzing && (
            <button 
              onClick={handleAnalyze}
              className="w-full py-4 bg-hydro-blue text-white rounded-2xl font-medium hover:bg-hydro-blue/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-hydro-blue/20"
            >
              Analyze Water Quality <ArrowRight size={20} />
            </button>
          )}

          {analyzing && (
            <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-white rounded-[40px] border border-hydro-sand/20">
              <Loader2 size={40} className="text-hydro-cyan animate-spin" />
              <p className="text-hydro-blue/60 font-medium animate-pulse">Scanning visual indicators...</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Score Card */}
                  <div className="md:col-span-2 p-8 bg-white rounded-[40px] border border-hydro-sand/20 shadow-sm flex items-center justify-between overflow-hidden relative">
                    <div className="relative z-10">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-hydro-blue/40 mb-2">Water Quality Score</div>
                      <div className="text-6xl font-serif text-hydro-blue">{result.score}<span className="text-2xl opacity-30">/100</span></div>
                    </div>
                    <div className="relative z-10 text-right">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider",
                        result.score > 70 ? "bg-green-100 text-green-700" : 
                        result.score > 40 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      )}>
                        {result.score > 70 ? "Pristine Condition" : result.score > 40 ? "Moderate Risk" : "Critical Alert"}
                      </div>
                    </div>
                    {/* Decorative background circle */}
                    <div className={cn(
                      "absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20",
                      result.score > 70 ? "bg-green-500" : result.score > 40 ? "bg-yellow-500" : "bg-red-500"
                    )} />
                  </div>

                  {/* Observations */}
                  <div className="p-6 bg-white rounded-[32px] border border-hydro-sand/20 shadow-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hydro-blue/40 mb-4 flex items-center gap-2">
                      <Activity size={12} /> Visual Observations
                    </h4>
                    <p className="text-sm text-hydro-blue/70 leading-relaxed italic">"{result.observations}"</p>
                  </div>

                  {/* Risks */}
                  <div className="p-6 bg-white rounded-[32px] border border-hydro-sand/20 shadow-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hydro-blue/40 mb-4 flex items-center gap-2">
                      <AlertTriangle size={12} /> Detected Indicators
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.risks.map((risk: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-hydro-cyan/5 rounded-xl text-[11px] font-medium text-hydro-cyan-dark border border-hydro-cyan/10">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900/90 leading-relaxed">
                    AI analysis may make mistakes. Always verify water safety with calibrated professional testing devices and certified experts before making health, treatment, or field decisions.
                  </p>
                </div>
              </motion.div>
            ) : !analyzing && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-hydro-sand/20 rounded-[40px] bg-white/50">
                <div className="w-16 h-16 bg-hydro-cyan/5 rounded-full flex items-center justify-center text-hydro-cyan/40 mb-6">
                  <Activity size={32} />
                </div>
                <h3 className="text-xl font-serif text-hydro-blue/40 mb-2">Awaiting Data</h3>
                <p className="text-sm text-hydro-blue/40">Upload an image to begin the automated environmental assessment.</p>
              </div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-3">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
