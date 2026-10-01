"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";

interface SoundStudioProps {
  isSoundPlaying: boolean;
  onToggleSound: () => void;
}

export default function SoundStudio({
  isSoundPlaying,
  onToggleSound,
}: SoundStudioProps) {
  const [volume, setVolume] = useState(8);
  const [bass, setBass] = useState(7);
  const [treble, setTreble] = useState(6);
  const [selectedPreset, setSelectedPreset] = useState("classic-rock");

  // Canvas visualizer
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const isPlayingRef = useRef(false);

  // Web Audio synth synthesizer loop
  useEffect(() => {
    if (!isSoundPlaying) {
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
      isPlayingRef.current = false;
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Gain node
        const gainNode = ctx.createGain();
        gainNode.gain.value = (volume / 10) * 0.15;
        gainNodeRef.current = gainNode;

        // Bass filter (lowshelf)
        const bassFilter = ctx.createBiquadFilter();
        bassFilter.type = "lowshelf";
        bassFilter.frequency.value = 250;
        bassFilter.gain.value = (bass - 5) * 3;
        bassFilterRef.current = bassFilter;

        // Treble filter (highshelf)
        const trebleFilter = ctx.createBiquadFilter();
        trebleFilter.type = "highshelf";
        trebleFilter.frequency.value = 3500;
        trebleFilter.gain.value = (treble - 5) * 3;
        trebleFilterRef.current = trebleFilter;

        // Connect chain: Osc -> Bass -> Treble -> Gain -> Destination
        bassFilter.connect(trebleFilter);
        trebleFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Simple musical arpeggio rhythm
        let step = 0;
        const notes = [110, 130.81, 146.83, 164.81, 196, 220, 261.63]; // A minor pentatonic rock vibe

        const playTone = () => {
          if (!isPlayingRef.current || !audioCtxRef.current) return;
          const now = audioCtxRef.current.currentTime;
          const osc = audioCtxRef.current.createOscillator();
          const noteGain = audioCtxRef.current.createGain();

          osc.type = "sawtooth";
          const freq = notes[step % notes.length];
          step++;

          osc.frequency.setValueAtTime(freq, now);

          // Subtle tube amp distortion warmth
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(noteGain);
          noteGain.connect(bassFilter);

          osc.start(now);
          osc.stop(now + 0.48);

          setTimeout(playTone, 280);
        };

        isPlayingRef.current = true;
        playTone();
      } else {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        isPlayingRef.current = true;
      }
    } catch {
      // Audio autoplay policy fallback
    }

    return () => {
      // Cleanup on unmount handled gracefully
    };
  }, [isSoundPlaying, volume, bass, treble]);

  // Update audio nodes when knobs change
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        (volume / 10) * 0.15,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume]);

  useEffect(() => {
    if (bassFilterRef.current && audioCtxRef.current) {
      bassFilterRef.current.gain.setTargetAtTime(
        (bass - 5) * 3,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [bass]);

  useEffect(() => {
    if (trebleFilterRef.current && audioCtxRef.current) {
      trebleFilterRef.current.gain.setTargetAtTime(
        (treble - 5) * 3,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [treble]);

  // Canvas Audio Equalizer Spectrum simulation
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const barCount = 36;
      const barWidth = (w - (barCount - 1) * 3) / barCount;

      for (let i = 0; i < barCount; i++) {
        const factor = i / barCount;
        // Low freq influenced by bass knob, high freq influenced by treble
        let influence = 1.0;
        if (factor < 0.35) {
          influence = (bass / 10) * 1.5;
        } else if (factor > 0.65) {
          influence = (treble / 10) * 1.4;
        } else {
          influence = ((bass + treble) / 20) * 1.2;
        }

        const baseHeight = isSoundPlaying
          ? (Math.sin(phase + i * 0.35) * 0.5 + 0.5) * h * 0.75 * (volume / 10) * influence
          : 6;

        const x = i * (barWidth + 3);
        const y = h - Math.max(4, baseHeight);

        // Gradient from warm gold to brass
        const grad = ctx.createLinearGradient(0, y, 0, h);
        if (isSoundPlaying) {
          grad.addColorStop(0, "#E0BE75");
          grad.addColorStop(0.5, "#C9A45C");
          grad.addColorStop(1, "rgba(201, 164, 92, 0.2)");
        } else {
          grad.addColorStop(0, "rgba(255, 255, 255, 0.2)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, Math.max(4, baseHeight));
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isSoundPlaying, volume, bass, treble]);

  const applyPreset = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === "classic-rock") {
      setVolume(8);
      setBass(8);
      setTreble(7);
    } else if (preset === "warm-acoustic") {
      setVolume(6);
      setBass(5);
      setTreble(8);
    } else if (preset === "heavy-groove") {
      setVolume(9);
      setBass(10);
      setTreble(5);
    } else if (preset === "flat-monitor") {
      setVolume(5);
      setBass(5);
      setTreble(5);
    }
  };

  return (
    <section id="sound" className="relative py-28 md:py-36 bg-[#080808] border-t border-b border-[#C9A45C]/15 overflow-hidden">
      {/* Background ambient radial warmth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C9A45C]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A45C] bg-[#C9A45C]/10 border border-[#C9A45C]/25 rounded-full mb-4">
            <Radio className="w-3 h-3 text-[#E0BE75]" />
            <span>Interactive Analog Sound Lab</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Dial in your sound.
            <br />
            <span className="text-[#C9A45C]">Analog precision.</span>
          </h2>

          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl mx-auto">
            The Marshall Kilburn II features three solid brass analog rotary dials for
            Volume, Bass, and Treble. Turn the knobs below to calibrate your custom
            acoustic profile in real time.
          </p>
        </div>

        {/* The Marshall Physical Control Plate Mockup */}
        <div className="max-w-4xl mx-auto bg-[#0F0F0F] rounded-2xl border-2 border-[#201D17] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 md:p-10 relative overflow-hidden">
          {/* Brushed brass border inlay line */}
          <div className="absolute inset-2 border border-[#C9A45C]/20 rounded-xl pointer-events-none" />

          {/* Top Control Plate Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <span className="font-serif italic font-black text-2xl md:text-3xl text-[#E0BE75]">
                Marshall
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A45C] border border-[#C9A45C]/30 px-2 py-0.5 rounded bg-black">
                ANALOG EQ PANEL
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "classic-rock", label: "Classic Rock" },
                { id: "warm-acoustic", label: "Warm Acoustic" },
                { id: "heavy-groove", label: "Bass Groove" },
                { id: "flat-monitor", label: "Flat EQ" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${
                    selectedPreset === p.id
                      ? "bg-[#C9A45C] text-black font-bold shadow-[0_0_12px_rgba(201,164,92,0.4)]"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rotary Knobs Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center py-4 relative z-10">
            {/* Knob 1: VOLUME */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                {/* Dial numbers tick circle */}
                <div className="absolute inset-0 rounded-full border border-white/10 flex items-center justify-center">
                  {[...Array(11)].map((_, i) => {
                    const angle = -140 + i * 28;
                    const rad = (angle * Math.PI) / 180;
                    const x = 50 + 42 * Math.cos(rad);
                    const y = 50 + 42 * Math.sin(rad);
                    return (
                      <span
                        key={i}
                        className={`absolute text-[9px] font-mono ${
                          i <= volume ? "text-[#E0BE75] font-bold" : "text-white/30"
                        }`}
                        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                      >
                        {i}
                      </span>
                    );
                  })}
                </div>

                {/* Brass Rotary Knob Body */}
                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E0BE75] via-[#9A7836] to-[#453414] shadow-2xl relative flex items-center justify-center border-2 border-[#C9A45C] cursor-pointer"
                  style={{
                    transform: `rotate(${-140 + volume * 28}deg)`,
                    transition: "transform 0.15s cubic-bezier(0.1, 1, 0.3, 1)",
                  }}
                >
                  {/* Knurling Texture Rings */}
                  <div className="absolute inset-1.5 rounded-full border border-black/40" />
                  <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#302410] to-[#604920]" />
                  {/* Pointer Notch */}
                  <div className="absolute top-1.5 w-1.5 h-3.5 bg-white rounded-full shadow-[0_0_6px_#fff]" />
                </div>
              </div>

              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#E0BE75]">
                VOLUME
              </span>
              <input
                type="range"
                min="0"
                max="10"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-36 mt-2 accent-[#C9A45C] cursor-pointer"
              />
              <span className="text-xs font-mono text-white/50 mt-1">Level {volume} / 10</span>
            </div>

            {/* Knob 2: BASS */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                <div className="absolute inset-0 rounded-full border border-white/10 flex items-center justify-center">
                  {[...Array(11)].map((_, i) => {
                    const angle = -140 + i * 28;
                    const rad = (angle * Math.PI) / 180;
                    const x = 50 + 42 * Math.cos(rad);
                    const y = 50 + 42 * Math.sin(rad);
                    return (
                      <span
                        key={i}
                        className={`absolute text-[9px] font-mono ${
                          i <= bass ? "text-[#E0BE75] font-bold" : "text-white/30"
                        }`}
                        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                      >
                        {i}
                      </span>
                    );
                  })}
                </div>

                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E0BE75] via-[#9A7836] to-[#453414] shadow-2xl relative flex items-center justify-center border-2 border-[#C9A45C] cursor-pointer"
                  style={{
                    transform: `rotate(${-140 + bass * 28}deg)`,
                    transition: "transform 0.15s cubic-bezier(0.1, 1, 0.3, 1)",
                  }}
                >
                  <div className="absolute inset-1.5 rounded-full border border-black/40" />
                  <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#302410] to-[#604920]" />
                  <div className="absolute top-1.5 w-1.5 h-3.5 bg-white rounded-full shadow-[0_0_6px_#fff]" />
                </div>
              </div>

              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#E0BE75]">
                BASS
              </span>
              <input
                type="range"
                min="0"
                max="10"
                value={bass}
                onChange={(e) => setBass(Number(e.target.value))}
                className="w-36 mt-2 accent-[#C9A45C] cursor-pointer"
              />
              <span className="text-xs font-mono text-white/50 mt-1">Level {bass} / 10</span>
            </div>

            {/* Knob 3: TREBLE */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                <div className="absolute inset-0 rounded-full border border-white/10 flex items-center justify-center">
                  {[...Array(11)].map((_, i) => {
                    const angle = -140 + i * 28;
                    const rad = (angle * Math.PI) / 180;
                    const x = 50 + 42 * Math.cos(rad);
                    const y = 50 + 42 * Math.sin(rad);
                    return (
                      <span
                        key={i}
                        className={`absolute text-[9px] font-mono ${
                          i <= treble ? "text-[#E0BE75] font-bold" : "text-white/30"
                        }`}
                        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                      >
                        {i}
                      </span>
                    );
                  })}
                </div>

                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E0BE75] via-[#9A7836] to-[#453414] shadow-2xl relative flex items-center justify-center border-2 border-[#C9A45C] cursor-pointer"
                  style={{
                    transform: `rotate(${-140 + treble * 28}deg)`,
                    transition: "transform 0.15s cubic-bezier(0.1, 1, 0.3, 1)",
                  }}
                >
                  <div className="absolute inset-1.5 rounded-full border border-black/40" />
                  <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#302410] to-[#604920]" />
                  <div className="absolute top-1.5 w-1.5 h-3.5 bg-white rounded-full shadow-[0_0_6px_#fff]" />
                </div>
              </div>

              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#E0BE75]">
                TREBLE
              </span>
              <input
                type="range"
                min="0"
                max="10"
                value={treble}
                onChange={(e) => setTreble(Number(e.target.value))}
                className="w-36 mt-2 accent-[#C9A45C] cursor-pointer"
              />
              <span className="text-xs font-mono text-white/50 mt-1">Level {treble} / 10</span>
            </div>
          </div>

          {/* Equalizer Spectrum Visualizer & Sound Playback Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Visualizer Canvas */}
            <div className="w-full md:w-2/3 h-20 bg-black/60 rounded-lg p-2 border border-white/5 relative flex items-center justify-center">
              <canvas
                ref={visualizerCanvasRef}
                width={500}
                height={80}
                className="w-full h-full block"
              />
              {!isSoundPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                    Press Play to Activate Audio Stream
                  </span>
                </div>
              )}
            </div>

            {/* Play Sound Button */}
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-end">
              <button
                onClick={onToggleSound}
                className={`w-full py-3.5 px-6 rounded font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                  isSoundPlaying
                    ? "bg-[#C9A45C] text-black shadow-[0_0_25px_rgba(201,164,92,0.4)]"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                {isSoundPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-black animate-pulse" />
                    <span>Live Audio Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-white/60" />
                    <span>Test Rock Amp Sound</span>
                  </>
                )}
              </button>
              <span className="text-[10px] font-mono text-white/40 mt-2">
                Simulated 36W Multi-Directional Audio
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
