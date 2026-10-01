"use client";

import React, { useState } from "react";
import { Sliders, Zap, Radio, Box, Ruler } from "lucide-react";

export default function SpecsSection() {
  const [activeCategory, setActiveCategory] = useState("audio");

  const categories = [
    { id: "audio", label: "Audio", icon: Sliders },
    { id: "power", label: "Power & Battery", icon: Zap },
    { id: "controls", label: "Controls & Connectivity", icon: Radio },
    { id: "physical", label: "Physical Units", icon: Ruler },
    { id: "box", label: "In The Box", icon: Box },
  ];

  const specsData: Record<string, { label: string; value: string }[]> = {
    audio: [
      { label: "Frequency Range", value: "52 – 20,000 Hz" },
      { label: "Driver Configuration", value: "1x 4″ Woofer + 2x 3/4″ Dome Tweeters" },
      { label: "Sound Field", value: "Multi-Directional Blumlein Stereo" },
      { label: "Maximum SPL", value: "100.4 dB SPL @ 1 m" },
      { label: "Cabinet Principle", value: "Bass-Reflex with Aerodynamic Rear Port" },
      {
        label: "Power Amplifiers",
        value: "1x 20W Class D (Woofer) + 2x 8W Class D (Tweeters) — 36W Total",
      },
      {
        label: "Tone Controls",
        value: "Solid Brass Analog Rotary Dials (Volume, Bass, Treble)",
      },
    ],
    power: [
      { label: "Battery Type", value: "Built-in Rechargeable High-Capacity Li-ion" },
      { label: "Play Time", value: "20+ Hours (at moderate volume)" },
      { label: "Quick Charge", value: "20 Minutes Charging = 3 Hours Playtime" },
      { label: "Full Recharge Time", value: "2.5 Hours" },
      { label: "Mains Input Voltage", value: "100 – 240 V" },
      { label: "Mains Frequency", value: "50 – 60 Hz" },
      { label: "Standby Power Consumption", value: "< 0.5 W" },
    ],
    controls: [
      { label: "Wireless Connectivity", value: "Bluetooth 5.0 with Qualcomm aptX" },
      { label: "Bluetooth Range", value: "10 m / 30 ft" },
      { label: "Multi-Host Functionality", value: "Connect 2 Bluetooth devices simultaneously" },
      { label: "Wired Connectivity", value: "3.5 mm Auxiliary Audio Input" },
      {
        label: "Top Controls",
        value: "Bluetooth Button, Power/Volume Knob, Bass Knob, Treble Knob, 10-LED Battery Meter",
      },
      { label: "Supported Codecs", value: "Qualcomm aptX, SBC, AAC" },
    ],
    physical: [
      { label: "Dimensions", value: "243 x 162 x 140 mm (9.57 x 6.42 x 5.51 in)" },
      { label: "Weight", value: "2.5 kg (5.5 lb)" },
      { label: "Water Resistance", value: "IPX2 Drop & Splash-Resistant" },
      { label: "Colorway Featured", value: "Black & Brass (Vintage Gold Accents)" },
      { label: "Carrying Handle", value: "Velvet-backed leather guitar strap with solid brass rivets" },
      { label: "Chassis Construction", value: "Vinyl-wrapped acoustically dead enclosure with flush corner caps" },
    ],
    box: [
      { label: "Loudspeaker", value: "Marshall Kilburn II Portable Loudspeaker" },
      { label: "Power Cable", value: "Mains Power Cord (region-specific)" },
      { label: "Documentation", value: "Quick Start Guide" },
      { label: "Legal", value: "Safety & Warranty Information Document" },
      { label: "Factory Warranty", value: "2 Years Official Marshall Global Warranty" },
    ],
  };

  return (
    <section id="specs" className="relative py-28 md:py-36 bg-[#050505] text-white border-t border-[#C9A45C]/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A45C] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C9A45C]" />
            <span>Complete Engineering Parameters</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Technical <span className="text-[#C9A45C]">Specifications.</span>
          </h2>
          <p className="text-sm md:text-base text-white/60 font-normal">
            Precision engineering data for the Marshall Kilburn II Black & Brass edition.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/10 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-[#C9A45C] text-black font-bold shadow-[0_0_15px_rgba(201,164,92,0.35)]"
                    : "bg-[#0E0E0E] text-white/60 hover:text-white hover:bg-white/5 border border-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Specs Table Matrix */}
        <div className="bg-[#0B0B0B] border border-[#C9A45C]/20 rounded-xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {specsData[activeCategory].map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 p-4 md:p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="md:col-span-4 text-xs font-mono uppercase tracking-widest text-[#E0BE75]/80">
                  {row.label}
                </div>
                <div className="md:col-span-8 text-xs md:text-sm text-white/90 font-sans">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
