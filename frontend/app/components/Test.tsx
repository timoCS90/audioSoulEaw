// components/RotateOnScroll.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const RotateOnScroll: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Definiere den Scroll-Fortschritt, bei dem die Rotation beginnen soll
  const rotate = useTransform(scrollYProgress, [0.4, 0.5], [0, 90]);

  // Optional: Begrenze die Rotation zwischen 0 und 90 Grad
  const constrainedRotate = useTransform(rotate, (value) => {
    if (value > 90) return 90;
    if (value < 0) return 0;
    return value;
  });

  return (
    <motion.div
      style={{
        rotate: constrainedRotate,
        transformOrigin: "center center",
        transition: "rotate 0.5s ease",
      }}
      className="w-full h-full fixed top-0 left-0 bg-white bg-opacity-90 z-50 flex items-center justify-center"
    >
      {/* Dein gesamter Seiteninhalt */}
      <div className="p-8">
        <h1 className="text-4xl">Willkommen auf der Seite!</h1>
        <p className="mt-4">
          Scroll nach unten, um den Rotations-Effekt zu sehen.
        </p>
        {/* Weitere Inhalte */}
      </div>
    </motion.div>
  );
};

export default RotateOnScroll;
