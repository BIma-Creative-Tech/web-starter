"use client";

/**
 * Animated Grid Pattern — 21st.dev: https://21st.dev/@dillionverma/components/animated-grid-pattern
 * (license: MIT). Author: Dillion Verma / Magic UI. Upstream source: magicuidesign/magicui
 * @ d7207e5692d14c00dceafa8488d6d01f197fa0e4 apps/www/registry/magicui/animated-grid-pattern.tsx (MIT).
 * Detail provenance & perubahan: COMPONENTS.md.
 *
 * Adaptasi performa (terukur Lighthouse mobile): upstream menganimasikan `opacity` tiap <rect> SVG
 * via Motion (JS per frame; elemen SVG tidak bisa di-composite → style/paint tiap frame). Di sini
 * garis grid tetap SVG statis, sedangkan kotak berkedip dirender sebagai elemen HTML absolut
 * dengan CSS keyframes opacity (dijalankan compositor, tanpa JS per frame). Posisi acak baru
 * tetap diambil saat siklus selesai (animationend), seperti upstream. Animasi dijeda saat di luar
 * viewport; reduced motion → hanya grid statis. Props API sama dengan upstream. Hook motion/react
 * diganti hook kecil lokal (src/lib/use-motion-prefs.ts) agar Motion tidak masuk JS awal.
 */
import { useCallback, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { useIsVisible, usePrefersReducedMotion } from "@/lib/use-motion-prefs";
import { cn } from "@/lib/utils";

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"div"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  maxOpacity?: number;
  /** Detik untuk fade-in (fade-out sama panjang), seperti upstream. */
  duration?: number;
  repeatDelay?: number;
}

type Square = { id: number; pos: [number, number]; iteration: number };

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  style,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const reduce = usePrefersReducedMotion() !== false;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useIsVisible(containerRef);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Array<Square>>([]);

  const getPos = useCallback((): [number, number] => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }, [dimensions.height, dimensions.width, height, width]);

  const updateSquarePosition = useCallback(
    (squareId: number) => {
      setSquares((currentSquares) => {
        const current = currentSquares[squareId];
        if (!current || current.id !== squareId) return currentSquares;
        const nextSquares = currentSquares.slice();
        nextSquares[squareId] = { ...current, pos: getPos(), iteration: current.iteration + 1 };
        return nextSquares;
      });
    },
    [getPos],
  );

  useEffect(() => {
    if (reduce || !dimensions.width || !dimensions.height) return;
    // Posisi acak hanya di klien (setelah ukuran diketahui) → tidak ada hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSquares(Array.from({ length: numSquares }, (_, i) => ({ id: i, pos: getPos(), iteration: 0 })));
  }, [dimensions.width, dimensions.height, getPos, numSquares, reduce]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions((cur) => {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          return cur.width === w && cur.height === h ? cur : { width: w, height: h };
        });
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  const cycle = duration * 2 + repeatDelay;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full overflow-hidden text-primary", className)}
      style={style}
      {...props}
    >
      <svg className="absolute inset-0 h-full w-full fill-none stroke-border">
        <defs>
          <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
            <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {reduce ? null : (
        <div className="absolute inset-0" style={{ opacity: maxOpacity, transform: `translate(${x}px, ${y}px)` }}>
          {squares.map(({ pos: [squareX, squareY], id: squareId, iteration }, index) => (
            <span
              key={`${squareId}-${iteration}`}
              onAnimationEnd={() => updateSquarePosition(squareId)}
              className="animate-grid-square absolute bg-current opacity-0"
              style={{
                left: squareX * width + 1,
                top: squareY * height + 1,
                width: width - 1,
                height: height - 1,
                animationDuration: `${cycle}s`,
                animationDelay: iteration === 0 ? `${index * 0.1}s` : "0s",
                animationPlayState: inView ? "running" : "paused",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
