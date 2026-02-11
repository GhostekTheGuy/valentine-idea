"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LightRays from "./LightRays";
import Grainient from "./Grainient";
import { ShimmerButton } from "./ShimmerButton";

/* ───── SVG Heart ───── */
function HeartSvg({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/* ───── Deterministic floating hearts (no hydration mismatch) ───── */
const FLOATING_HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: `${((i * 37 + 13) % 100)}%`,
  duration: `${11 + (i % 5) * 3}s`,
  delay: `${(i * 1.4) % 9}s`,
  scale: 0.6 + (i % 4) * 0.3,
  size: 16 + (i % 4) * 6,
}));

export default function Home() {
  const [showLove, setShowLove] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [burstKey, setBurstKey] = useState(0);

  const handleYes = useCallback(() => {
    setShowLove(true);
    setBurstKey((k) => k + 1);
    setTimeout(() => {
      document
        .getElementById("love-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  }, []);

  const handleNoInteraction = useCallback(() => {
    setNoAttempts((prev) => {
      const next = prev + 1;
      const range = 120 + next * 40;
      const angle = Math.PI * 2 * ((next * 137.5) / 360); // golden-angle spiral
      const x = Math.cos(angle) * (range * 0.6);
      const y = Math.sin(angle) * (range * 0.4);
      setNoOffset({ x, y });
      return next;
    });
  }, []);

  const noScale = Math.max(0.25, 1 - noAttempts * 0.08);
  const noHidden = noAttempts >= 10;

  return (
    <main className="min-h-screen overflow-x-hidden relative">
      {/* ── Grainient background ── */}
      <div className="fixed inset-0 z-0">
        <Grainient
          color1="#74072d"
          color2="#2f0f1b"
          color3="#120206"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* ── LightRays ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ff6b8a"
          raysSpeed={0.4}
          lightSpread={0.6}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0}
          distortion={0}
          pulsating={true}
          fadeDistance={1.2}
          saturation={0.7}
        />
      </div>

      {/* ── Vignette ── */}
      <div className="vignette" />

      {/* ── Floating hearts ── */}
      {FLOATING_HEARTS.map((h, i) => (
        <div
          key={i}
          className="floating-heart"
          style={
            {
              "--x": h.left,
              "--duration": h.duration,
              "--delay": h.delay,
              "--scale": h.scale,
            } as React.CSSProperties
          }
        >
          <HeartSvg size={h.size} />
        </div>
      ))}

      {/* ── Heart burst on "tak" ── */}
      <AnimatePresence>
        {burstKey > 0 && (
          <>
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 18;
              const dist = 180 + (i % 3) * 100;
              return (
                <motion.div
                  key={`burst-${burstKey}-${i}`}
                  className="fixed z-50 text-[#ff4d6d] pointer-events-none"
                  style={{ left: "50%", top: "45%" }}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: 0.8 + (i % 3) * 0.4,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                >
                  <HeartSvg size={18 + (i % 3) * 8} />
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ SECTION 1 — Question ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-10 md:gap-14 px-6">
        {/* Smoke texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: "url(/Smoke_005.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Decorative: aaaa.png — top-left */}
        <motion.div
          className="absolute top-6 left-2 md:top-12 md:left-8 z-10"
          initial={{ opacity: 0, x: -40, rotate: -10 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Image
            src="/aaaa.png"
            alt=""
            width={200}
            height={192}
            className="w-28 h-auto md:w-44"
            priority
          />
        </motion.div>

        {/* Decorative: Warstwa 2 — top-right, rotated */}
        <motion.div
          className="absolute top-16 -right-4 md:top-12 md:right-4 z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, rotate: -33 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Image
            src="/Warstwa 2.png"
            alt=""
            width={150}
            height={155}
            className="w-24 h-auto md:w-36"
            priority
          />
        </motion.div>

        {/* Question text */}
        <motion.div
          className="relative z-20 text-center mt-16 md:mt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <h1 className="font-serif text-[3.2rem] leading-[1.1] md:text-8xl lg:text-9xl font-bold text-[#F0EDE6] tracking-tight">
            Czy <em>Asiula</em>
          </h1>
          <p className="font-serif text-lg md:text-3xl lg:text-4xl text-[#F0EDE6] mt-6 md:mt-10">
            zostanie <em>Kocura</em> walentynką?
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="relative z-20 flex items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {/* TAK button */}
          <ShimmerButton
            onClick={handleYes}
            shimmerColor="#F0EDE6"
            background="rgba(240, 237, 230, 0.12)"
            className="!px-8 !py-2.5 md:!px-12 md:!py-3.5 font-serif text-lg md:text-2xl tracking-wider text-[#F0EDE6]"
          >
            tak
          </ShimmerButton>

          {/* NIE button — runs away */}
          {!noHidden && (
            <motion.div
              onMouseEnter={handleNoInteraction}
              onTouchStart={(e) => {
                e.preventDefault();
                handleNoInteraction();
              }}
              animate={{
                x: noOffset.x,
                y: noOffset.y,
                scale: noScale,
                opacity: noScale,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <ShimmerButton
                shimmerColor="transparent"
                shimmerSize="0"
                background="transparent"
                className="!px-8 !py-2.5 md:!px-12 md:!py-3.5 font-serif text-lg md:text-2xl tracking-wider text-[#F0EDE6]/50 !border-[#F0EDE6]/15 !shadow-none"
              >
                nie
              </ShimmerButton>
            </motion.div>
          )}
        </motion.div>

      </section>

      {/* ═══════════ Cloud — overlaps hero bottom & section 2 top ═══════════ */}
      <div className="relative w-full h-0 pointer-events-none z-30">
        <Image
          src="/pngwing.com.png"
          alt=""
          width={1280}
          height={400}
          className="w-full h-auto relative -translate-y-1/2"
        />
      </div>

      {/* ═══════════ SECTION 2 — My Love ═══════════ */}
      <AnimatePresence>
        {showLove && (
          <motion.section
            id="love-section"
            className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-40 md:pt-52 3xl:pt-104 pb-20 3xl:pb-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Decorative heart — top-right */}
            <motion.div
              className="absolute top-10 right-6 md:top-16 md:right-16 text-[#F0EDE6]/40 pointer-events-none"
              style={{ rotate: "42deg" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              <HeartSvg size={70} />
            </motion.div>

            {/* Decorative heart — bottom-left */}
            <motion.div
              className="absolute bottom-28 left-4 md:bottom-36 md:left-12 text-[#F0EDE6]/40 pointer-events-none"
              style={{ rotate: "-27deg" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              <HeartSvg size={60} />
            </motion.div>

            {/* "My love" heading image */}
            <motion.div
              className="mb-8 md:mb-12 pulse-gentle"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            >
              <Image
                src="/Group 4.png"
                alt="My love"
                width={800}
                height={200}
                className="w-64 md:w-96 lg:w-[500px] h-auto"
              />
            </motion.div>

            {/* Photo with cloud */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
            >
              <Image
                src="/1212.png"
                alt="My love"
                width={1000}
                height={800}
                className="w-80 md:w-[500px] lg:w-[600px] h-auto"
              />
            </motion.div>

            {/* Bottom decorative hearts row */}
            <motion.div
              className="flex gap-4 mt-12 text-[#F0EDE6]/20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <HeartSvg size={24} />
              <HeartSvg size={32} />
              <HeartSvg size={20} />
              <HeartSvg size={28} />
              <HeartSvg size={22} />
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
