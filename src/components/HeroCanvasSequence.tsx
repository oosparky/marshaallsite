"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Layers,
  ArrowDown,
  ArrowUpRight,
  Disc3,
} from "lucide-react";

interface HeroCanvasSequenceProps {
  onOpenOrderModal: () => void;
  onExploreSpecs: () => void;
}

const TOTAL_FRAMES = 300;

export default function HeroCanvasSequence({
  onOpenOrderModal,
  onExploreSpecs,
}: HeroCanvasSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loaded frames cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const isFrameLoadedRef = useRef<boolean[]>([]);

  // State
  const [loadProgress, setLoadProgress] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);

  // Knobs preview state inside Act 4
  const [knobVolume, setKnobVolume] = useState(7);
  const [knobBass, setKnobBass] = useState(8);
  const [knobTreble, setKnobTreble] = useState(6);

  // Target and current frame for smooth lerp
  const targetFrameRef = useRef(1);
  const currentFrameFloatRef = useRef(1);
  const animFrameIdRef = useRef<number | null>(null);

  // Format frame filename
  const getFrameUrl = useCallback((index: number) => {
    const padIndex = String(index).padStart(3, "0");
    return `/sequence/ezgif-frame-${padIndex}.jpg`;
  }, []);

  // Preload frames systematically
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES + 1).fill(null);
    isFrameLoadedRef.current = new Array(TOTAL_FRAMES + 1).fill(false);

    let loadedCount = 0;

    // Helper to load single frame
    const loadFrame = (idx: number, isHighPriority = false): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[idx]) {
          resolve();
          return;
        }

        const img = new Image();
        if (isHighPriority) {
          img.fetchPriority = "high";
        }
        img.src = getFrameUrl(idx);

        img.onload = () => {
          imagesRef.current[idx] = img;
          isFrameLoadedRef.current[idx] = true;
          loadedCount++;
          const pct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(pct);

          if (idx === 1) {
            setIsInitialReady(true);
          }
          resolve();
        };

        img.onerror = () => {
          // Resolve on error to avoid stalling
          resolve();
        };
      });
    };

    // 1. Immediately load frame 1
    loadFrame(1, true).then(() => {
      // 2. Load keyframes across the sequence (every 5th frame)
      const keyframes: number[] = [];
      for (let i = 5; i <= TOTAL_FRAMES; i += 5) {
        keyframes.push(i);
      }

      Promise.all(keyframes.map((f) => loadFrame(f))).then(() => {
        // 3. Load all remaining frames
        const remaining: number[] = [];
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (i % 5 !== 0) {
            remaining.push(i);
          }
        }

        // Load remaining in chunks to avoid network congestion
        const loadBatch = async (batch: number[]) => {
          for (let i = 0; i < batch.length; i += 12) {
            const slice = batch.slice(i, i + 12);
            await Promise.all(slice.map((f) => loadFrame(f)));
          }
        };

        loadBatch(remaining);
      });
    });
  }, [getFrameUrl]);

  // Handle scroll progress computation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = containerRef.current.offsetHeight - windowH;

      if (totalDist <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalDist));

      setScrollProgress(progress);

      // Map progress to frames:
      // 0.00 -> 0.82: explode from frame 1 to 295
      // 0.82 -> 1.00: reassemble from frame 295 back down to 1
      let targetFrame = 1;
      if (progress <= 0.82) {
        const explodeRatio = progress / 0.82;
        targetFrame = Math.round(1 + explodeRatio * 294);
      } else {
        const reassembleRatio = (progress - 0.82) / 0.18;
        targetFrame = Math.round(295 - reassembleRatio * 294);
      }

      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, targetFrame));
      targetFrameRef.current = targetFrame;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Canvas render loop with smooth interpolation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      // Smooth lerp towards target frame
      const target = targetFrameRef.current;
      const current = currentFrameFloatRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.02) {
        currentFrameFloatRef.current += diff * 0.16;
      } else {
        currentFrameFloatRef.current = target;
      }

      const activeFrame = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(currentFrameFloatRef.current))
      );
      setCurrentFrameNum(activeFrame);

      // Find best available loaded image (activeFrame or closest loaded frame)
      let imgToDraw = imagesRef.current[activeFrame];

      if (!imgToDraw || !imgToDraw.complete) {
        // Search nearest loaded frame
        for (let offset = 1; offset < 20; offset++) {
          const prevIdx = activeFrame - offset;
          if (prevIdx >= 1 && imagesRef.current[prevIdx]?.complete) {
            imgToDraw = imagesRef.current[prevIdx];
            break;
          }
          const nextIdx = activeFrame + offset;
          if (nextIdx <= TOTAL_FRAMES && imagesRef.current[nextIdx]?.complete) {
            imgToDraw = imagesRef.current[nextIdx];
            break;
          }
        }
      }

      // Resize canvas to match display size & DPR
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      if (
        canvas.width !== Math.floor(displayW * dpr) ||
        canvas.height !== Math.floor(displayH * dpr)
      ) {
        canvas.width = Math.floor(displayW * dpr);
        canvas.height = Math.floor(displayH * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Seamless Deep Charcoal / Black Background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, displayW, displayH);

      // Subtle warm radial atmosphere behind the speaker center
      const centerX = displayW / 2;
      const centerY = displayH / 2;
      const radius = Math.max(displayW, displayH) * 0.55;

      const radialGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        40,
        centerX,
        centerY,
        radius
      );
      radialGlow.addColorStop(0, "rgba(201, 164, 92, 0.07)");
      radialGlow.addColorStop(0.5, "rgba(180, 130, 60, 0.02)");
      radialGlow.addColorStop(1, "rgba(5, 5, 5, 0)");

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, displayW, displayH);

      // Draw the image sequence frame centered with letterboxing / containment
      if (imgToDraw && imgToDraw.naturalWidth) {
        const imgW = imgToDraw.naturalWidth;
        const imgH = imgToDraw.naturalHeight;
        const imgAspect = imgW / imgH;
        const screenAspect = displayW / displayH;

        let drawW: number;
        let drawH: number;

        if (screenAspect > imgAspect) {
          drawH = displayH * 0.94;
          drawW = drawH * imgAspect;
        } else {
          drawW = displayW * 0.96;
          drawH = drawW / imgAspect;
        }

        // Slight vertical offset for comfortable typography balance
        const drawX = (displayW - drawW) / 2;
        const drawY = (displayH - drawH) / 2 + 10;

        ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Determine which storytelling chapter is currently active
  // Act 1: Hero (0.00 – 0.15)
  // Act 2: Engineering Reveal (0.15 – 0.40)
  // Act 3: Sound / Stereo Experience (0.40 – 0.65)
  // Act 4: Control & Character (0.65 – 0.82)
  // Act 5: Portability & Reassembly (0.82 – 1.00)
  const isAct1 = scrollProgress < 0.15;
  const isAct2 = scrollProgress >= 0.15 && scrollProgress < 0.40;
  const isAct3 = scrollProgress >= 0.40 && scrollProgress < 0.65;
  const isAct4 = scrollProgress >= 0.65 && scrollProgress < 0.82;
  const isAct5 = scrollProgress >= 0.82;

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative w-full bg-[#050505] text-white selection:bg-[#C9A45C] selection:text-black"
      style={{ height: "460vh" }}
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Full-screen Background Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0 pointer-events-none"
        />

        {/* Ambient Top & Bottom Edge Blending Gradients */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-10" />

        {/* Loading Indicator HUD / Progress */}
        <AnimatePresence>
          {(!isInitialReady || loadProgress < 25) && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center p-6"
            >
              <div className="flex flex-col items-center max-w-sm text-center">
                <span className="font-serif italic font-black text-4xl text-[#E0BE75] mb-4">
                  Marshall
                </span>
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/50 mb-6">
                  Kilburn II · Calibration
                </span>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-[#9A7836] via-[#E0BE75] to-[#C9A45C] transition-all duration-200"
                    style={{ width: `${Math.max(8, loadProgress)}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#C9A45C]">
                  <span>ACOUSTIC SEQUENCE LOADING</span>
                  <span>{loadProgress}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top-Right Technical Frame Telemetry HUD */}
        <div className="absolute top-20 right-6 md:right-12 z-20 hidden sm:flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/40 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-ping" />
            <span>36W STEREO</span>
          </div>
          <span className="text-white/20">|</span>
          <span>FRAME {String(currentFrameNum).padStart(3, "0")}/300</span>
          <span className="text-white/20">|</span>
          <span className="text-[#C9A45C]">
            {isAct1 && "STAGE 01: HERO"}
            {isAct2 && "STAGE 02: DISASSEMBLY"}
            {isAct3 && "STAGE 03: ACOUSTIC CORE"}
            {isAct4 && "STAGE 04: CONTROLS"}
            {isAct5 && "STAGE 05: REASSEMBLY"}
          </span>
        </div>

        {/* ============================================================ */}
        {/* STORY OVERLAYS (SYNCHRONIZED WITH SCROLL PROGRESS) */}
        {/* ============================================================ */}

        {/* ACT 1: HERO / INTRO (0.00 – 0.15) */}
        <AnimatePresence>
          {isAct1 && (
            <motion.div
              key="act-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 md:p-12 pointer-events-none text-center"
            >
              {/* Top micro badge */}
              <div className="pt-20 md:pt-24 flex items-center gap-3">
                <span className="h-[1px] w-8 md:w-16 bg-[#C9A45C]/50" />
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#E0BE75]">
                  EST. 1962 · LONDON, ENGLAND
                </span>
                <span className="h-[1px] w-8 md:w-16 bg-[#C9A45C]/50" />
              </div>

              {/* Main Hero Typography */}
              <div className="max-w-4xl mx-auto my-auto flex flex-col items-center">
                <span className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-[#E0BE75] mb-2 font-black tracking-tight">
                  Marshall
                </span>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-4">
                  Kilburn II
                </h1>
                <p className="text-lg sm:text-2xl md:text-3xl font-light text-[#E0BE75] tracking-wide mb-3">
                  Big sound. Go anywhere.
                </p>
                <p className="max-w-xl text-sm md:text-base text-white/65 leading-relaxed font-normal">
                  Powerful portable sound, wrapped in unmistakable Marshall
                  character. 36 watts of multi-directional Blumlein stereo audio.
                </p>
              </div>

              {/* Bottom Ticker & Scroll prompt */}
              <div className="pb-8 flex flex-col items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/50 bg-[#0B0B0B]/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                  <span>36W Class D</span>
                  <span className="text-[#C9A45C]">✦</span>
                  <span>20+ Hours Playtime</span>
                  <span className="text-[#C9A45C]">✦</span>
                  <span>Blumlein Stereo</span>
                  <span className="text-[#C9A45C]">✦</span>
                  <span>IPX2 Water Resistant</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#C9A45C] animate-bounce">
                  <span>Scroll to explore architecture</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACT 2: ENGINEERING REVEAL (0.15 – 0.40) */}
        <AnimatePresence>
          {isAct2 && (
            <motion.div
              key="act-2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex items-center justify-start p-6 md:p-16 lg:p-24 pointer-events-none"
            >
              <div className="max-w-xl text-left pointer-events-auto bg-[#050505]/75 p-6 md:p-8 rounded-xl backdrop-blur-md border border-[#C9A45C]/20 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#C9A45C] bg-[#C9A45C]/10 rounded border border-[#C9A45C]/30">
                    Acoustic Architecture // 01
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white mb-4">
                  Built to move.
                  <br />
                  <span className="text-[#C9A45C]">Engineered to perform.</span>
                </h2>

                <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6 font-normal">
                  Every element is designed around powerful portable sound—from
                  the acoustic architecture to the carefully tuned drivers and
                  rugged construction.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-left">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#C9A45C] tracking-wider">
                      Design
                    </span>
                    <span className="text-xs font-semibold text-white">
                      Precision
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#C9A45C] tracking-wider">
                      Output
                    </span>
                    <span className="text-xs font-semibold text-white">
                      36W Power
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#C9A45C] tracking-wider">
                      Form
                    </span>
                    <span className="text-xs font-semibold text-white">
                      Portability
                    </span>
                  </div>
                </div>

                {/* Micro interactive hotspots hint */}
                <div className="mt-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#E0BE75]/80">
                  <Layers className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Separating outer chassis & steel grille</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACT 3: SOUND / STEREO EXPERIENCE (0.40 – 0.65) */}
        <AnimatePresence>
          {isAct3 && (
            <motion.div
              key="act-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex items-center justify-end p-6 md:p-16 lg:p-24 pointer-events-none"
            >
              <div className="max-w-xl text-left pointer-events-auto bg-[#050505]/75 p-6 md:p-8 rounded-xl backdrop-blur-md border border-[#C9A45C]/20 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#C9A45C] bg-[#C9A45C]/10 rounded border border-[#C9A45C]/30">
                    Blumlein Stereo Architecture // 02
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white mb-4">
                  Portable. Powerful.
                  <br />
                  <span className="text-[#C9A45C]">Immersive.</span>
                </h2>

                <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6 font-normal">
                  Experience rich, room-filling sound from a compact speaker
                  engineered to deliver powerful performance wherever you take
                  it.
                </p>

                {/* 4 Feature Statements */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-[#0B0B0B] rounded border border-white/10 hover:border-[#C9A45C]/40 transition-colors">
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Wide, immersive sound.
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      Multi-directional 360°
                    </span>
                  </div>
                  <div className="p-3 bg-[#0B0B0B] rounded border border-white/10 hover:border-[#C9A45C]/40 transition-colors">
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Powerful low-end.
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      20W Class D Woofer
                    </span>
                  </div>
                  <div className="p-3 bg-[#0B0B0B] rounded border border-white/10 hover:border-[#C9A45C]/40 transition-colors">
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Clear detail.
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      Dual 8W Tweeters
                    </span>
                  </div>
                  <div className="p-3 bg-[#0B0B0B] rounded border border-white/10 hover:border-[#C9A45C]/40 transition-colors">
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Designed to fill room.
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      100.4 dB SPL peak
                    </span>
                  </div>
                </div>

                {/* Interactive Hotspot HUD Pins */}
                <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-[#C9A45C]">
                  <Disc3 className="w-3.5 h-3.5 animate-spin" />
                  <span>Acoustic chambers & amplification uncoupled</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACT 4: CONTROL & CHARACTER (0.65 – 0.82) */}
        <AnimatePresence>
          {isAct4 && (
            <motion.div
              key="act-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex items-center justify-start p-6 md:p-16 lg:p-24 pointer-events-none"
            >
              <div className="max-w-xl text-left pointer-events-auto bg-[#050505]/80 p-6 md:p-8 rounded-xl backdrop-blur-md border border-[#C9A45C]/30 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#C9A45C] bg-[#C9A45C]/10 rounded border border-[#C9A45C]/30">
                    Analog Interface // 03
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white mb-3">
                  Your sound.
                  <br />
                  <span className="text-[#C9A45C]">Your settings.</span>
                </h2>

                <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6 font-normal">
                  Shape the experience with tactile controls designed to put your
                  sound directly in your hands. Solid brass analog dials engineered
                  with micro-knurled grip.
                </p>

                {/* Interactive Analog Dials Preview */}
                <div className="p-4 bg-[#0B0B0B] rounded-lg border border-[#C9A45C]/25 mb-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#C9A45C]">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Tactile Control Plate
                    </span>
                    <span className="text-white/40">Black & Brass</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    {/* Volume */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono uppercase text-white/60 mb-1">
                        Volume
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={knobVolume}
                        onChange={(e) => setKnobVolume(Number(e.target.value))}
                        className="w-full accent-[#C9A45C] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-[#E0BE75] mt-1">
                        {knobVolume}
                      </span>
                    </div>

                    {/* Bass */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono uppercase text-white/60 mb-1">
                        Bass
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={knobBass}
                        onChange={(e) => setKnobBass(Number(e.target.value))}
                        className="w-full accent-[#C9A45C] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-[#E0BE75] mt-1">
                        {knobBass}
                      </span>
                    </div>

                    {/* Treble */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono uppercase text-white/60 mb-1">
                        Treble
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={knobTreble}
                        onChange={(e) => setKnobTreble(Number(e.target.value))}
                        className="w-full accent-[#C9A45C] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-[#E0BE75] mt-1">
                        {knobTreble}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span>Bluetooth 5.0 aptX Multi-Host</span>
                  <span className="text-[#C9A45C]">30ft Range</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACT 5: PORTABILITY & REASSEMBLY (0.82 – 1.00) */}
        <AnimatePresence>
          {isAct5 && (
            <motion.div
              key="act-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 md:p-12 pointer-events-none text-center"
            >
              {/* Top micro badge */}
              <div className="pt-20 md:pt-24 flex items-center gap-3">
                <span className="h-[1px] w-8 md:w-16 bg-[#C9A45C]/50" />
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#E0BE75]">
                  FULL REASSEMBLY · READY FOR THE ROAD
                </span>
                <span className="h-[1px] w-8 md:w-16 bg-[#C9A45C]/50" />
              </div>

              {/* Final Assembled Climax */}
              <div className="max-w-3xl mx-auto my-auto flex flex-col items-center pointer-events-auto bg-[#050505]/75 p-6 md:p-10 rounded-2xl backdrop-blur-md border border-[#C9A45C]/30 shadow-2xl">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-3">
                  Big sound.
                  <br />
                  <span className="text-[#C9A45C]">Wherever you go.</span>
                </h2>

                <p className="text-base sm:text-lg text-white/80 font-normal mb-2 max-w-xl">
                  Marshall Kilburn II. Portable power with unmistakable Marshall
                  character.
                </p>

                <p className="text-xs font-mono uppercase tracking-widest text-[#E0BE75] mb-6">
                  Made to move. Built to perform.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={onOpenOrderModal}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#C9A45C] hover:bg-[#E0BE75] text-[#050505] font-mono text-xs uppercase tracking-widest font-bold rounded-sm shadow-[0_0_30px_rgba(201,164,92,0.4)] hover:shadow-[0_0_45px_rgba(201,164,92,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Experience Kilburn II</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onExploreSpecs}
                    className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/5 border border-white/20 hover:border-[#C9A45C] text-white font-mono text-xs uppercase tracking-widest rounded-sm transition-all duration-300"
                  >
                    See full specs
                  </button>
                </div>
              </div>

              {/* Bottom specs summary */}
              <div className="pb-8 flex items-center gap-6 text-[10px] md:text-xs font-mono uppercase tracking-wider text-white/50">
                <span>2.5 kg / 5.5 lb</span>
                <span>•</span>
                <span>20+ Hours Play</span>
                <span>•</span>
                <span>Bluetooth 5.0 aptX</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Scroll Indicator Needle on left border */}
        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 -rotate-90 origin-center mb-6">
            PROGRESS
          </span>
          <div className="w-1 h-32 bg-white/10 rounded-full relative overflow-hidden">
            <div
              className="w-full bg-[#C9A45C] absolute top-0 left-0 transition-all duration-150"
              style={{ height: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#C9A45C] mt-2">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </section>
  );
}
