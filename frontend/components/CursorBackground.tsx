"use client";

import { useMotionTemplate, useMotionValue, motion, animate } from "framer-motion";
import { useEffect } from "react";

export default function CursorBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Create a gradient that moves with the mouse
  // We use a large radial gradient to create a "spotlight" effect
  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(16, 185, 129, 0.25), /* Increased Opacity */
      rgba(59, 130, 246, 0.15), /* Increased Opacity */
      transparent 80%
    )
  `;

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: background,
      }}
    />
  );
}
