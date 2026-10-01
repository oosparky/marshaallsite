"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#030303] text-white border-t border-[#C9A45C]/20 pt-20 pb-12 overflow-hidden">
      {/* Background Marshall Script Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
        <span className="font-serif italic font-black text-[22vw] leading-none text-white whitespace-nowrap">
          Marshall
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Heritage Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <span className="font-serif italic font-black text-4xl sm:text-5xl md:text-6xl text-[#E0BE75] tracking-tight block">
              Marshall
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C9A45C] mt-2 block">
              EST. 1962 · LONDON, ENGLAND · 60+ YEARS OF LOUD
            </span>
          </div>

          {/* Newsletter Box */}
          <div className="w-full md:w-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-2">
              Join the Marshall Sound Society
            </span>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 bg-[#0D0D0D] border border-white/15 focus:border-[#C9A45C] rounded text-xs text-white placeholder-white/40 focus:outline-none w-64 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#C9A45C] hover:bg-[#E0BE75] text-black font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center gap-1.5 transition-colors"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-white/10 text-xs font-mono">
          <div>
            <span className="text-[#C9A45C] uppercase tracking-widest block mb-4">
              Speakers
            </span>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <span className="text-[#E0BE75] font-semibold">Kilburn II</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Acton III
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Stanmore III
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Woburn III
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Emberton II
                </span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#C9A45C] uppercase tracking-widest block mb-4">
              Headphones
            </span>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Major V
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Minor IV
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Monitor II A.N.C.
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Motif II A.N.C.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#C9A45C] uppercase tracking-widest block mb-4">
              Engineering
            </span>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Blumlein Stereo Sound
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Class D Architecture
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Road Armor & IPX2
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Marshall Bluetooth App
                </span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#C9A45C] uppercase tracking-widest block mb-4">
              Heritage
            </span>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Jim Marshall Legacy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Rock & Roll History
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Authorized Retailers
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Product Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Back to top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/40">
          <div>
            © {new Date().getFullYear()} Marshall Group. All Rights Reserved.
            Marshall is a trademark of Marshall Amplification Plc.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-[#E0BE75] transition-colors focus:outline-none"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#C9A45C]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
