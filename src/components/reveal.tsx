/**
 * Reveal saat di-scroll ke viewport (sekali) — SERVER component (tanpa JS hydration).
 * Hanya menandai elemen (`data-reveal`, jeda via CSS var); <ScrollEnhancer> (satu client
 * component di layout, start saat idle) "mempersenjatai" elemen yang masih di luar viewport lalu
 * memicu transisi CSS opacity + transform saat terlihat. Tanpa JS / reduced motion → konten
 * langsung tampil, tidak pernah terjebak tersembunyi.
 */
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Detik. */
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div data-reveal="" className={className} style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}
