import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Leaf, AlertTriangle, Loader2, X, ArrowRight, Activity, Info } from 'lucide-react';
import { identifyPlant } from '../../services/helixmind';
import { cn } from '../../lib/utils';

export const PlantScan = () => {
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
      const data = await identifyPlant(image);
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
          <Leaf size={14} className="text-hydro-cyan" /> Botanical Identification
        </div>
        <h2 className="text-4xl font-serif mb-4 bg-gradient-to-br from-hydro-blue-dark to-hydro-blue bg-clip-text text-transparent">PlantScan Analysis</h2>
        <p className="text-hydro-blue/60 max-w-xl mx-auto">
          Upload an image of a leaf, flower, or bark to instantly identify the plant species and learn about its ecological role.
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
              Identify Plant <ArrowRight size={20} />
            </button>
          )}

          {analyzing && (
            <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-white rounded-[40px] border border-hydro-sand/20">
              <Loader2 size={40} className="text-hydro-cyan animate-spin" />
              <p className="text-hydro-blue/60 font-medium animate-pulse">Analyzing botanical features...</p>
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
                  {/* Name Card */}
                  <div className="md:col-span-2 p-8 bg-white rounded-[40px] border border-hydro-sand/20 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-hydro-blue/40 mb-2">Species Identification</div>
                      <h3 className="text-4xl font-serif text-hydro-blue mb-1">{result.commonName}</h3>
                      <p className="text-lg italic text-hydro-cyan-dark font-serif">{result.scientificName}</p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-10 bg-hydro-cyan" />
                  </div>

                  {/* Poisonous Warning */}
                  {result.isPoisonous && (
                    <div className="md:col-span-2 p-6 bg-red-50 rounded-[32px] border border-red-100 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-red-800 mb-1 uppercase tracking-wider">Toxicity Warning</h4>
                        <p className="text-sm text-red-700 leading-relaxed">{result.warning}</p>
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-6 bg-white rounded-[32px] border border-hydro-sand/20 shadow-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hydro-blue/40 mb-4 flex items-center gap-2">
                      <Info size={12} /> Family & Habitat
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-hydro-blue block">Family</span>
                        <span className="text-sm text-hydro-blue/70">{result.family}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-hydro-blue block">Habitat</span>
                        <span className="text-sm text-hydro-blue/70">{result.habitat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Conservation Status */}
                  <div className="p-6 bg-white rounded-[32px] border border-hydro-sand/20 shadow-sm flex flex-col justify-center">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hydro-blue/40 mb-4 flex items-center gap-2">
                      <Activity size={12} /> Conservation Status
                    </h4>
                    <div className="inline-flex items-center justify-center px-4 py-3 bg-hydro-cyan/10 rounded-2xl text-sm font-medium text-hydro-cyan-dark border border-hydro-cyan/20 text-center">
                      {result.conservationStatus}
                    </div>
                  </div>

                  {/* Description & Fun Fact */}
                  <div className="md:col-span-2 p-8 bg-hydro-blue text-white rounded-[40px] shadow-xl shadow-hydro-blue/20">
                    <div className="mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-3">Description</h4>
                      <p className="text-sm text-white/80 leading-relaxed">{result.description}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-3">Fun Fact</h4>
                      <p className="text-sm text-white/80 leading-relaxed italic">"{result.funFact}"</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900/90 leading-relaxed">
                    AI identification can be incorrect. Confirm plant species with a professional field guide, qualified botanist, or certified local expert before handling or consuming unknown plants.
                  </p>
                </div>
              </motion.div>
            ) : !analyzing && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-hydro-sand/20 rounded-[40px] bg-white/50">
                <div className="w-16 h-16 bg-hydro-cyan/5 rounded-full flex items-center justify-center text-hydro-cyan/40 mb-6">
                  <Leaf size={32} />
                </div>
                <h3 className="text-xl font-serif text-hydro-blue/40 mb-2">Awaiting Data</h3>
                <p className="text-sm text-hydro-blue/40">Upload an image to begin the automated botanical assessment.</p>
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
