'use client';

import { useRef, useCallback, useState, useEffect, useMemo, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false], [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false], [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(', ');
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

interface AnimateOpts {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (t: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}

function animateValue({ start = 0, end = 100, duration = 3000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

// static part of the fill-layer mask (only the trailing conic-gradient changes per frame)
const FILL_STATIC_MASK = [
  'linear-gradient(to bottom, black, black)',
  'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
  'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
  'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
  'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
  'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
].join(', ');

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderLayerRef = useRef<HTMLDivElement>(null);
  const fillLayerRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);

  // isHovered/sweepActive change rarely (a couple times per interaction) so React
  // state is fine here. edgeProximity/cursorAngle change every animation frame,
  // so those are now written directly to the DOM below instead of via setState —
  // that's what was forcing a full React re-render (×6 cards) on every frame.
  const [isHovered, setIsHovered] = useState(false);
  const [sweepActive, setSweepActive] = useState(false);
  const isHoveredRef = useRef(isHovered);
  const sweepActiveRef = useRef(sweepActive);
  const lastFrameRef = useRef({ edgeProximity: 0, cursorAngle: 45 });

  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);
  useEffect(() => { sweepActiveRef.current = sweepActive; }, [sweepActive]);

  const colorSensitivity = edgeSensitivity + 20;

  // these only depend on props, not on animation state — compute once and reuse
  const meshGradients = useMemo(() => buildMeshGradients(colors), [colors]);
  const borderBg = useMemo(() => meshGradients.map(g => `${g} border-box`), [meshGradients]);
  const fillBg = useMemo(() => meshGradients.map(g => `${g} padding-box`), [meshGradients]);
  const glowBoxShadow = useMemo(() => buildBoxShadow(glowColor, glowIntensity), [glowColor, glowIntensity]);

  const applyFrame = useCallback((edgeProximity: number, cursorAngle: number) => {
    lastFrameRef.current = { edgeProximity, cursorAngle };
    const isVisible = isHoveredRef.current || sweepActiveRef.current;
    const borderOpacity = isVisible
      ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
      : 0;
    const glowOpacity = isVisible
      ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
      : 0;
    const angleDeg = `${cursorAngle.toFixed(3)}deg`;

    const borderEl = borderLayerRef.current;
    const fillEl = fillLayerRef.current;
    const glowEl = glowLayerRef.current;

    if (borderEl) {
      const mask = `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`;
      borderEl.style.opacity = String(borderOpacity);
      borderEl.style.maskImage = mask;
      borderEl.style.setProperty('-webkit-mask-image', mask);
    }
    if (fillEl) {
      const conic = `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`;
      const mask = `${FILL_STATIC_MASK}, ${conic}`;
      fillEl.style.opacity = String(borderOpacity * fillOpacity);
      fillEl.style.maskImage = mask;
      fillEl.style.setProperty('-webkit-mask-image', mask);
    }
    if (glowEl) {
      const mask = `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`;
      glowEl.style.opacity = String(glowOpacity);
      glowEl.style.maskImage = mask;
      glowEl.style.setProperty('-webkit-mask-image', mask);
    }
  }, [colorSensitivity, edgeSensitivity, coneSpread, fillOpacity]);

  const setTransitionSpeed = useCallback((fast: boolean) => {
    const t = fast ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out';
    if (borderLayerRef.current) borderLayerRef.current.style.transition = t;
    if (fillLayerRef.current) fillLayerRef.current.style.transition = t;
    if (glowLayerRef.current) glowLayerRef.current.style.transition = t;
  }, []);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  // rAF-throttled pointer handler: only the latest position per frame is applied,
  // instead of running full style recalculation on every pointermove event.
  const pendingPointRef = useRef<{ x: number; y: number } | null>(null);
  const rafScheduledRef = useRef(false);

  const flushPointerFrame = useCallback(() => {
    rafScheduledRef.current = false;
    const card = cardRef.current;
    const point = pendingPointRef.current;
    if (!card || !point) return;
    const proximity = getEdgeProximity(card, point.x, point.y);
    const angle = getCursorAngle(card, point.x, point.y);
    applyFrame(proximity, angle);
  }, [applyFrame, getEdgeProximity, getCursorAngle]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    pendingPointRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (!rafScheduledRef.current) {
      rafScheduledRef.current = true;
      requestAnimationFrame(flushPointerFrame);
    }
  }, [flushPointerFrame]);

  const handlePointerEnter = useCallback(() => {
    setTransitionSpeed(true);
    setIsHovered(true);
    isHoveredRef.current = true;
    applyFrame(lastFrameRef.current.edgeProximity, lastFrameRef.current.cursorAngle);
  }, [applyFrame, setTransitionSpeed]);

  const handlePointerLeave = useCallback(() => {
    setTransitionSpeed(false);
    setIsHovered(false);
    isHoveredRef.current = false;
    applyFrame(lastFrameRef.current.edgeProximity, lastFrameRef.current.cursorAngle);
  }, [applyFrame, setTransitionSpeed]);

  useEffect(() => {
    if (!animated) return;
    const angleStart = 110;
    const angleEnd = 465;

    let edgeProximity = 0;
    let cursorAngle = angleStart;

    setTransitionSpeed(true);
    setSweepActive(true);
    sweepActiveRef.current = true;
    cursorAngle = angleStart;
    applyFrame(edgeProximity, cursorAngle);

    animateValue({
      duration: 500,
      onUpdate: v => { edgeProximity = v / 100; applyFrame(edgeProximity, cursorAngle); },
    });
    animateValue({
      ease: easeInCubic, duration: 1500, end: 50,
      onUpdate: v => { cursorAngle = (angleEnd - angleStart) * (v / 100) + angleStart; applyFrame(edgeProximity, cursorAngle); },
    });
    animateValue({
      ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100,
      onUpdate: v => { cursorAngle = (angleEnd - angleStart) * (v / 100) + angleStart; applyFrame(edgeProximity, cursorAngle); },
    });
    animateValue({
      ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => { edgeProximity = v / 100; applyFrame(edgeProximity, cursorAngle); },
      onEnd: () => {
        setSweepActive(false);
        sweepActiveRef.current = false;
        setTransitionSpeed(false);
        applyFrame(edgeProximity, cursorAngle);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative grid isolate border border-white/15 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow: 'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
      }}
    >
      {/* mesh gradient border */}
      <div
        ref={borderLayerRef}
        className="absolute inset-0 rounded-[inherit] z-[-1]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: 0,
          transition: 'opacity 0.75s ease-in-out',
        }}
      />

      {/* mesh gradient fill near edges */}
      <div
        ref={fillLayerRef}
        className="absolute inset-0 rounded-[inherit] z-[-1]"
        style={{
          border: '1px solid transparent',
          background: fillBg.join(', '),
          maskComposite: 'subtract, add, add, add, add, add',
          WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over, source-over',
          opacity: 0,
          mixBlendMode: 'soft-light',
          transition: 'opacity 0.75s ease-in-out',
        } as React.CSSProperties}
      />

      {/* outer glow */}
      <span
        ref={glowLayerRef}
        className="absolute pointer-events-none z-1 rounded-[inherit]"
        style={{
          inset: `${-glowRadius}px`,
          opacity: 0,
          mixBlendMode: 'plus-lighter',
          transition: 'opacity 0.75s ease-in-out',
        } as React.CSSProperties}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: glowBoxShadow,
          }}
        />
      </span>

      <div className="flex flex-col relative overflow-auto z-1">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;