import React, { useState } from 'react';
import { Navbar, Hero, AboutSection } from './components/layout/Landing';
import { HydroScan } from './components/analysis/HydroScan';
import { PlantScan } from './components/analysis/PlantScan';
import { ParticleTextEffect } from './components/ui/particle-text-effect';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'home' | 'hydro' | 'plant' | 'thank-you';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-hydro-cream selection:bg-hydro-cyan/20">
      <Navbar onNavigate={setCurrentPage} />
      
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero 
                onStartHydro={() => setCurrentPage('hydro')} 
                onStartPlant={() => setCurrentPage('plant')}
              />
              <AboutSection />
              
              <footer className="py-24 px-6 border-t border-hydro-sand/20 flex flex-col items-center">
                <div className="max-w-7xl w-full mx-auto flex flex-col items-center gap-12">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-hydro-cyan to-hydro-cyan-light rounded-full flex items-center justify-center text-white shadow-md shadow-hydro-cyan/20">
                      <span className="text-xs font-bold">E</span>
                    </div>
                    <span className="font-serif text-xl font-semibold bg-gradient-to-br from-hydro-cyan-dark to-hydro-cyan bg-clip-text text-transparent">EcoScan AI</span>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <button 
                      onClick={() => setCurrentPage('thank-you')}
                      className="text-sm font-medium text-hydro-blue hover:text-hydro-cyan transition-colors"
                    >
                      View Credits
                    </button>
                    <p className="text-hydro-blue/40 text-[10px] font-mono uppercase tracking-[0.3em] italic">
                      "Protecting the planet, one scan at a time."
                    </p>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}
          
          {currentPage === 'hydro' && (
            <motion.div
              key="hydro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pt-24"
            >
              <HydroScan />
            </motion.div>
          )}

          {currentPage === 'plant' && (
            <motion.div
              key="plant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pt-24"
            >
              <PlantScan />
            </motion.div>
          )}
          
          {currentPage === 'thank-you' && (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pt-24 min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-hydro-cream to-white z-0" />
              <div className="w-full max-w-6xl relative z-10 mb-12">
                <ParticleTextEffect words={["Thank You", "James N", "Nicholas J", "Eithanniel", "Russell", "Almeria", "Ralph"]} />
              </div>
              
              <div className="relative z-10 max-w-5xl w-full px-6 pb-24">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif text-hydro-blue mb-4">The Team Behind EcoScan AI</h2>
                  <p className="text-hydro-blue/60">Dedicated to building tools for a sustainable future.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { name: "James N", role: "Leader" },
                    { name: "Nicholas J", role: "Back End Dev" },
                    { name: "Eithanniel", role: "Front End Dev & UI/UX" },
                    { name: "Ralph", role: "Producer" },
                    { name: "Almeria", role: "UI Design" },
                    { name: "Russell", role: "UI Design" }
                  ].map((member, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-hydro-sand/30 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hydro-cyan/20 to-hydro-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-hydro-blue font-serif font-bold text-lg">{member.name.charAt(0)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-hydro-blue mb-1">{member.name}</h3>
                      <p className="text-xs font-mono uppercase tracking-widest text-hydro-cyan-dark">{member.role}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
