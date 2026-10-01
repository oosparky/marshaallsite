"use client";

import React from "react";
import Image from "next/image";
import { BatteryCharging, Droplets, Compass, Shield, Zap } from "lucide-react";

export default function PortabilitySection() {
  return (
    <section id="portability" className="relative py-28 md:py-36 bg-[#080808] text-white border-t border-[#C9A45C]/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A45C] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#E0BE75]" />
            <span>Untethered Performance</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Born for the road.
            <br />
            <span className="text-[#C9A45C]">20+ Hours of loud.</span>
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-normal">
            Kilburn II weighs in at only 2.5 kg (5.5 lbs) and offers 20+ hours of portable
            playtime on a single charge. Its compact size and guitar-inspired carrying
            strap make it the ultimate road companion.
          </p>
        </div>

        {/* Feature Grid & Hero Lifestyle Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Lifestyle Backstage Photo */}
          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-full rounded-2xl overflow-hidden border border-[#C9A45C]/25 shadow-2xl group">
            <Image
              src="/images/lifestyle.jpg"
              alt="Marshall Kilburn II carried backstage by musician"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#050505]/85 backdrop-blur-md rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E0BE75]">
                  HERITAGE ON THE MOVE
                </span>
                <span className="text-[10px] font-mono text-white/50">
                  WEIGHT: 2.5 KG
                </span>
              </div>
              <p className="text-xs text-white/80 font-normal">
                Guitar-inspired leather carry strap with velvet underside and solid brass
                lock pins.
              </p>
            </div>
          </div>

          {/* Right: Technical Mobility Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {/* Card 1: 20+ Hours Playtime */}
            <div className="p-6 bg-[#0E0E0E] rounded-xl border border-white/10 hover:border-[#C9A45C]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A45C]/10 rounded-lg border border-[#C9A45C]/30 text-[#E0BE75]">
                  <BatteryCharging className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      20+ Hours Portable Playtime
                    </span>
                    <span className="text-[10px] font-mono text-[#C9A45C] bg-[#C9A45C]/15 px-2 py-0.5 rounded">
                      SINGLE CHARGE
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Play uninterrupted from day into night. The top panel visual battery
                    indicator gives you real-time percentage readouts with 10 red LEDs.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: 20-Minute Quick Charge */}
            <div className="p-6 bg-[#0E0E0E] rounded-xl border border-white/10 hover:border-[#C9A45C]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A45C]/10 rounded-lg border border-[#C9A45C]/30 text-[#E0BE75]">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      Quick Charge: 20 Min = 3 Hours
                    </span>
                    <span className="text-[10px] font-mono text-[#C9A45C] bg-[#C9A45C]/15 px-2 py-0.5 rounded">
                      EXPRESS RECHARGE
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Caught with an empty battery before heading out? 20 minutes of charging
                    gives you 3 hours of portable playtime. Fully recharge in 2.5 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: IPX2 Water Resistance */}
            <div className="p-6 bg-[#0E0E0E] rounded-xl border border-white/10 hover:border-[#C9A45C]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A45C]/10 rounded-lg border border-[#C9A45C]/30 text-[#E0BE75]">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      IPX2 Water-Resistant Design
                    </span>
                    <span className="text-[10px] font-mono text-[#C9A45C] bg-[#C9A45C]/15 px-2 py-0.5 rounded">
                      WEATHERPROOF
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Kilburn II has an IPX2 water-resistant rating, meaning it can withstand
                    a little water or light rain without missing a single beat.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Multi-Host Bluetooth 5.0 */}
            <div className="p-6 bg-[#0E0E0E] rounded-xl border border-white/10 hover:border-[#C9A45C]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A45C]/10 rounded-lg border border-[#C9A45C]/30 text-[#E0BE75]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      Bluetooth 5.0 aptX Multi-Host
                    </span>
                    <span className="text-[10px] font-mono text-[#C9A45C] bg-[#C9A45C]/15 px-2 py-0.5 rounded">
                      30 FT RANGE
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Easily connect and switch between two Bluetooth devices. Now you and a
                    friend can take turns playing what you want to hear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
