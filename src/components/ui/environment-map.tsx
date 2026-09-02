"use client";

import { useEffect, useRef, useState } from "react";
import { createRenderer, type PortfolioFace } from "./environment-map-utils/renderer";

type EnvironmentMapProps = {
  onFaceSelect?: (face: PortfolioFace) => void;
};

export function Example({ onFaceSelect }: EnvironmentMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({ canvas, onFaceSelect });
    void renderer.ready;
    return () => renderer.dispose();
  }, [onFaceSelect]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} onPointerDown={() => setHintVisible(false)} className="block h-full w-full touch-none" />
      <div className={`pointer-events-none absolute bottom-[18px] left-1/2 z-[2] -translate-x-1/2 text-center text-xs font-medium uppercase tracking-[0.08em] text-white/80 transition-opacity duration-[400ms] ${hintVisible ? "opacity-100" : "opacity-0"}`}>
        drag to look around · click a face to open
      </div>
    </div>
  );
}

export default Example;
