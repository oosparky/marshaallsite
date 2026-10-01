"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Cpu, ShieldCheck, Zap, Disc3 } from "lucide-react";

export default function EngineeringSection() {
  const [activeTab, setActiveTab] = useState(0);

  const modules = [
    {
      id: "blumlein",
      title: "Blumlein Stereo Architecture",
      icon: Disc3,
      tag: "Spatial Acoustic Physics",
      headline: "Multi-directional true stereophonic sound.",
      description:
        "Kilburn II uses Blumlein Stereo Sound construction to produce a 360° sound field that envelops every listener in the room. By separating the spatial content of stereo recordings, it delivers clear, room-filling sound indoors and out.",
      specs: [
        { label: "Dispersion Field", val: "360° Multi-Directional" },
        { label: "Max Sound Pressure", val: "100.4 dB SPL @ 1 m" },
        { label: "Frequency Range", val: "52 – 20,000 Hz" },
      ],
    },
    {
      id: "amplification",
      title: "36W Tri-Amp Class D Engine",
      icon: Zap,
      tag: "Power Delivery",
      headline: "Dedicated amplification for each acoustic driver.",
      description:
        "Equipped with three dedicated Class D amplifiers: one 20W amplifier driving the bass woofer and two 8W amplifiers driving dual tweeters. This discrete architecture ensures zero crosstalk, punchy low-end transient response, and pristine vocal clarity.",
      specs: [
        { label: "Woofer Amp", val: "1x 20W Class D" },
        { label: "Tweeter Amps", val: "2x 8W Class D" },
        { label: "Total Peak Headroom", val: "36 Watts RMS" },
      ],
    },
    {
      id: "chassis",
      title: "Bass-Reflex Enclosure",
      icon: Cpu,
      tag: "Chassis Mechanics",
      headline: "Precision aerodynamic cabinet tuning.",
      description:
        "The Kilburn II enclosure features a computer-modeled rear bass-reflex port. By tuning the internal air column to 52 Hz, the speaker extracts deep sub-bass frequencies while dampening internal standing waves and air turbulence.",
      specs: [
        { label: "Cabinet Principle", val: "Bass-Reflex with Rear Port" },
        { label: "Cabinet Material", val: "Acoustically Dead MDF Core" },
        { label: "Tuned Resonance", val: "52 Hz Sub Resonance" },
      ],
    },
    {
      id: "rugged",
      title: "Tour-Tested Road Armor",
      icon: ShieldCheck,
      tag: "Durability & Ingress",
      headline: "Flush-mounted corner caps and IPX2 rating.",
      description:
        "Constructed for life on the road. Flush-mounted corner caps absorb impacts like professional touring equipment, while the solid steel metal grille draws direct inspiration from legendary rock microphones. Water-resistant to withstand unexpected weather.",
      specs: [
        { label: "Water Resistance", val: "IPX2 Drop & Splash Proof" },
        { label: "Corner Armor", val: "Flush-Mounted Polycarbonate" },
        { label: "Front Grille", val: "Solid Steel Mesh" },
      ],
    },
  ];

  const current = modules[activeTab];

  return (
    <section id="engineering" className="relative py-28 md:py-36 bg-[#050505] text-white overflow-hidden">
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 technical-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#C9A45C]/20">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A45C] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C9A45C]" />
              <span>Deep Technical Breakdown</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
              Anatomy of <span className="text-[#C9A45C]">Pure Sound.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/60 font-mono leading-relaxed">
            Every millimeter of the Kilburn II is meticulously engineered for acoustic
            supremacy, mechanical longevity, and classic Marshall heritage.
          </p>
        </div>

        {/* Modules Tabs Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(index)}
                className={`p-5 rounded-lg border text-left transition-all duration-300 relative flex flex-col justify-between ${
                  isActive
                    ? "bg-[#111111] border-[#C9A45C] shadow-[0_0_25px_rgba(201,164,92,0.18)]"
                    : "bg-[#0B0B0B]/60 border-white/10 hover:border-white/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-[#E0BE75]" : "text-white/40"
                      }`}
                    />
                    <span className="text-[10px] font-mono text-white/40">
                      0{index + 1}
                    </span>
                  </div>
                  <span
                    className={`text-xs md:text-sm font-bold block ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {mod.title}
                  </span>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A45C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B0B0B] border border-[#C9A45C]/25 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Brass Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C9A45C]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C9A45C]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C9A45C]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C9A45C]" />

          {/* Left Text / Specs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A45C] mb-2 block">
              {current.tag}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white mb-4 leading-tight">
              {current.headline}
            </h3>
            <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8">
              {current.description}
            </p>

            {/* Micro Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#141414] rounded-lg border border-white/5">
              {current.specs.map((item, idx) => (
                <div key={idx} className="border-l-2 border-[#C9A45C] pl-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                    {item.label}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-white mt-0.5 block">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image / Macro Detail Showcase */}
          <div className="lg:col-span-5 relative h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-[#C9A45C]/30 shadow-2xl group">
            <Image
              src="/images/knobs-detail.jpg"
              alt="Marshall Kilburn II Engineering Detail"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/75 backdrop-blur-md rounded border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#E0BE75] block">
                  CRAFTSMANSHIP
                </span>
                <span className="text-xs font-semibold text-white">
                  Black & Brass Edition
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50">
                100% Solid Brass Rivets
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
