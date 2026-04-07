import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Droplets, Globe } from 'lucide-react';

export const Navbar = ({ onNavigate }: { onNavigate: (page: 'home' | 'hydro' | 'plant' | 'thank-you') => void }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-50 bg-white/95 backdrop-blur-md rounded-[16px] shadow-sm border border-black/5">
      <div className="px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-hydro-cyan to-hydro-cyan-light rounded-full flex items-center justify-center text-white shadow-lg shadow-hydro-cyan/20">
            <Globe size={24} />
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('hydro')}
            className="text-sm font-medium hover:text-hydro-cyan transition-colors flex items-center gap-2"
          >
            <Droplets size={16} /> HydroScan
          </button>
          <button 
            onClick={() => onNavigate('plant')}
            className="text-sm font-medium hover:text-hydro-cyan transition-colors flex items-center gap-2"
          >
            <Leaf size={16} /> PlantScan
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Hero = ({ onStartHydro, onStartPlant }: { onStartHydro: () => void, onStartPlant: () => void }) => {
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden flex flex-col items-center justify-center pt-32 pb-20 px-6">
      {/* Video Background */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-serif font-medium tracking-widest uppercase mb-6 border border-white/20 shadow-lg">
            <Globe size={16} className="text-hydro-cyan-light" /> EcoScan AI
          </div>
          <p className="text-xl text-white/90 leading-relaxed mb-10 max-w-2xl font-medium drop-shadow-lg">
            Setiap tahun, jutaan orang keracunan dari air yang kelihatannya bersih dan ribuan lainnya dari tanaman yang kelihatannya biasa aja.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onStartHydro}
              className="px-8 py-4 bg-hydro-cyan hover:bg-hydro-cyan-light text-hydro-blue-dark rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center gap-3 shadow-xl shadow-hydro-cyan/20"
            >
              <Droplets size={20} /> Launch HydroScan
            </button>
            <button 
              onClick={onStartPlant}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-medium hover:bg-white/20 transition-colors flex items-center gap-3 shadow-sm"
            >
              <Leaf size={20} /> Try PlantScan
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const AboutSection = () => {
  return (
    <section className="py-24 bg-hydro-cream px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* HydroScan AI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 shadow-xl shadow-hydro-blue/5 border border-hydro-sand/20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-hydro-blue">
                <Droplets size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-hydro-blue">HydroScan AI</h3>
            </div>
            <ul className="space-y-5">
              {[
                "Banyak orang, terutama di daerah terpencil, nggak punya akses ke uji lab air yang mahal",
                "Pendaki, camper, dan traveler sering ragu apakah air di alam aman untuk diminum",
                "Petani dan nelayan butuh cara cepat untuk ngecek kondisi air irigasi atau tambak mereka",
                "Di situasi darurat (banjir, gempa), nggak ada waktu nunggu hasil lab — butuh jawaban cepat"
              ].map((text, i) => (
                <li key={i} className="flex gap-4 text-hydro-blue/80">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-hydro-cyan shrink-0" />
                  <span className="text-base leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PlantScan AI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[32px] p-8 shadow-xl shadow-hydro-blue/5 border border-hydro-sand/20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-hydro-cyan">
                <Leaf size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-hydro-blue">PlantScan AI</h3>
            </div>
            <ul className="space-y-5">
              {[
                "Anak-anak dan hewan peliharaan rentan menyentuh atau memakan tanaman berbahaya tanpa disadari",
                "Pecinta alam, hikers, dan forager sering salah identifikasi tanaman liar yang bisa beracun",
                "Orang tua dan guru butuh cara mudah untuk edukasi tentang tanaman di sekitar mereka",
                "Banyak tanaman hias populer yang ternyata berbahaya, tapi mayoritas orang nggak tahu"
              ].map((text, i) => (
                <li key={i} className="flex gap-4 text-hydro-blue/80">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-hydro-cyan shrink-0" />
                  <span className="text-base leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
