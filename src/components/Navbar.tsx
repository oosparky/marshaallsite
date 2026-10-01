"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenOrderModal: () => void;
  onToggleSound: () => void;
  isSoundPlaying: boolean;
}

export default function Navbar({
  onOpenOrderModal,
  onToggleSound,
  isSoundPlaying,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check current section
      const sections = ["overview", "sound", "engineering", "portability", "specs"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#050505]/85 backdrop-blur-md border-b border-[#C9A45C]/20 py-3.5 shadow-2xl"
          : "bg-transparent py-6 opacity-85 hover:opacity-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Marshall Kilburn II Brand Mark */}
        <button
          onClick={() => scrollToSection("overview")}
          className="group flex items-center gap-3 text-left focus:outline-none"
          aria-label="Marshall Kilburn II Home"
        >
          <div className="relative">
            <span className="font-serif italic font-black text-2xl md:text-3xl tracking-normal text-white group-hover:text-[#E0BE75] transition-colors duration-300">
              Marshall
            </span>
            <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[1px] bg-[#C9A45C] transition-all duration-300" />
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest text-[#C9A45C] border border-[#C9A45C]/30 rounded-sm bg-[#0B0B0B]">
            Kilburn II
          </span>
        </button>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-mono tracking-widest uppercase">
          {[
            { id: "overview", label: "Overview" },
            { id: "sound", label: "Sound" },
            { id: "engineering", label: "Engineering" },
            { id: "portability", label: "Portability" },
            { id: "specs", label: "Specs" },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative py-1 transition-all duration-300 focus:outline-none ${
                  isActive
                    ? "text-[#E0BE75] font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A45C] shadow-[0_0_8px_#C9A45C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Audio Preview Toggle & Primary CTA */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 border ${
              isSoundPlaying
                ? "bg-[#C9A45C]/20 border-[#C9A45C] text-[#E0BE75] shadow-[0_0_15px_rgba(201,164,92,0.3)]"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
            }`}
            title="Toggle Rock Amp Sound Simulation"
            aria-label="Toggle Sound"
          >
            {isSoundPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E0BE75] animate-pulse" />
                <span className="hidden sm:inline">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline">Audio</span>
              </>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenOrderModal}
            className="group relative inline-flex items-center gap-2 px-4 md:px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#050505] bg-[#C9A45C] hover:bg-[#E0BE75] font-bold rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(201,164,92,0.25)] hover:shadow-[0_0_30px_rgba(201,164,92,0.5)] focus:outline-none"
          >
            <span>Experience Kilburn II</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
