"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCanvasSequence from "@/components/HeroCanvasSequence";
import SoundStudio from "@/components/SoundStudio";
import EngineeringSection from "@/components/EngineeringSection";
import PortabilitySection from "@/components/PortabilitySection";
import SpecsSection from "@/components/SpecsSection";
import OrderModal from "@/components/OrderModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  const toggleSound = () => {
    setIsSoundPlaying((prev) => !prev);
  };

  const handleOpenOrder = () => {
    setIsOrderModalOpen(true);
  };

  const handleExploreSpecs = () => {
    const specsEl = document.getElementById("specs");
    if (specsEl) {
      specsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-[#C9A45C] selection:text-black">
      {/* Fixed Navigation Bar */}
      <Navbar
        onOpenOrderModal={handleOpenOrder}
        onToggleSound={toggleSound}
        isSoundPlaying={isSoundPlaying}
      />

      {/* Hero Canvas Image-Sequence Scrollytelling Section */}
      <HeroCanvasSequence
        onOpenOrderModal={handleOpenOrder}
        onExploreSpecs={handleExploreSpecs}
      />

      {/* Interactive Analog Sound Studio */}
      <SoundStudio
        isSoundPlaying={isSoundPlaying}
        onToggleSound={toggleSound}
      />

      {/* Deep Engineering & Acoustic Architecture */}
      <EngineeringSection />

      {/* Portability, Durability & Battery Life */}
      <PortabilitySection />

      {/* Complete Technical Specifications Matrix */}
      <SpecsSection />

      {/* Footer & Marshall Lineage */}
      <Footer />

      {/* Order Modal Drawer */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </main>
  );
}
