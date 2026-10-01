"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Check, ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [selectedColor, setSelectedColor] = useState("black-brass");
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const colorways = [
    { id: "black-brass", name: "Black & Brass", colorHex: "#C9A45C", border: "#C9A45C" },
    { id: "black", name: "Classic Black", colorHex: "#222222", border: "#555" },
    { id: "burgundy", name: "Vintage Burgundy", colorHex: "#5E1924", border: "#8C2534" },
  ];

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      // Keep feedback for 3 seconds
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#0B0B0B] border border-[#C9A45C]/30 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle Brass Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#C9A45C]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#C9A45C]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#C9A45C]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#C9A45C]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isOrdered ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#C9A45C]/20 border border-[#C9A45C] text-[#E0BE75] flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <span className="font-serif italic font-black text-3xl text-[#E0BE75] mb-2">
              Marshall
            </span>
            <h3 className="text-2xl font-black uppercase text-white mb-2">
              Order Confirmed
            </h3>
            <p className="text-sm text-white/70 max-w-md mb-6">
              Thank you for choosing the Marshall Kilburn II in Black & Brass. Your
              complimentary express shipment is being prepped at our distribution hub.
            </p>
            <button
              onClick={() => {
                setIsOrdered(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#C9A45C] text-black font-mono text-xs uppercase tracking-widest font-bold rounded"
            >
              Back to Experience
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif italic font-black text-2xl text-[#E0BE75]">
                Marshall
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A45C] border border-[#C9A45C]/30 px-2 py-0.5 rounded bg-black">
                FLAGSHIP PORTABLE AUDIO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
              {/* Image Preview */}
              <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center p-2">
                <Image
                  src="/sequence/ezgif-frame-001.jpg"
                  alt="Marshall Kilburn II Black and Brass"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Details */}
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                  Kilburn II
                </h3>
                <p className="text-xs text-white/60 mb-3">
                  36W Portable Bluetooth Loudspeaker
                </p>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-[#E0BE75] font-mono">
                    $299.99
                  </span>
                  <span className="text-xs text-green-400 font-mono">
                    In Stock · Ships Free
                  </span>
                </div>

                {/* Color Selector */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-2">
                    Select Finish
                  </span>
                  <div className="flex items-center gap-3">
                    {colorways.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          selectedColor === c.id
                            ? "border-[#C9A45C] bg-[#C9A45C]/15 text-[#E0BE75]"
                            : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: c.colorHex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-1.5 text-[11px] text-white/70 font-mono">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span>Free Global Express Courier (2–3 Days)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span>2-Year Marshall Global Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span>30-Day Hassle-Free Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-white/50">
                Authorized Marshall Retail Direct
              </span>

              <button
                onClick={handleCheckout}
                className="px-8 py-3 bg-[#C9A45C] hover:bg-[#E0BE75] text-black font-mono text-xs uppercase tracking-widest font-bold rounded flex items-center gap-2 shadow-[0_0_25px_rgba(201,164,92,0.4)] transition-all"
              >
                <span>Complete Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
