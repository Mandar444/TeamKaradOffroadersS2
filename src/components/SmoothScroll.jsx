"use client";

import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.08, 
      duration: 1.5, 
      smoothWheel: true,
      wheelMultiplier: 1.1,
      infinite: false,
    }}>
      {children}
    </ReactLenis>
  );
}
