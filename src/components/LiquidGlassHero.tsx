import React, { useEffect, useRef, useState } from 'react';


export const LiquidGlassHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const idleRafRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 992px)').matches);

  // High-Performance Physics Engine — big, satisfying jello
  const fireJello = (strength = 1.0) => {
    const el = heroRef.current;
    if (!el) return;

    // Cancel any idle animation
    if (idleRafRef.current) {
      cancelAnimationFrame(idleRafRef.current);
      idleRafRef.current = null;
    }

    let scaleX = 1, scaleY = 1, skewY = 0;
    // Tripled initial kick — very visible wobble
    let vScaleX = -0.38 * strength;
    let vScaleY = 0.55 * strength;
    let vSkewY  = 1.2  * strength;
    let lastT: number | null = null;
    const K = 70; // lower = slower / springier
    const D = 4.5; // lower = more oscillations before settling

    const tick = (ts: number) => {
      if (!lastT) lastT = ts;
      const dt = Math.min((ts - lastT) / 1000, 0.05);
      lastT = ts;

      const axX = -K * (scaleX - 1) - D * vScaleX;
      vScaleX += axX * dt;
      scaleX  += vScaleX * dt;

      const axY = -K * (scaleY - 1) - D * vScaleY;
      vScaleY += axY * dt;
      scaleY  += vScaleY * dt;

      const axS = -K * skewY - D * vSkewY;
      vSkewY += axS * dt;
      skewY  += vSkewY * dt;

      el.style.transform = `translateZ(0) scaleX(${scaleX.toFixed(4)}) scaleY(${scaleY.toFixed(4)}) skewY(${skewY.toFixed(3)}deg)`;

      if (
        Math.abs(vScaleX) > 0.0005 ||
        Math.abs(scaleX - 1) > 0.0005 ||
        Math.abs(vSkewY) > 0.005 ||
        Math.abs(skewY) > 0.005
      ) {
        idleRafRef.current = requestAnimationFrame(tick);
      } else {
        el.style.transform = 'translateZ(0)';
        idleRafRef.current = null;
        startIdleBreath(); // resume gentle idle after jello settles
      }
    };
    idleRafRef.current = requestAnimationFrame(tick);
  };

  // Gentle continuous "breathing" idle — keeps it alive when static
  const startIdleBreath = () => {
    const el = heroRef.current;
    if (!el || idleRafRef.current) return;

    const start = performance.now();
    const breathTick = (ts: number) => {
      const t = (ts - start) / 1000;
      const s = 1 + Math.sin(t * 0.9) * 0.008;  // very subtle
      const sk = Math.sin(t * 1.1) * 0.06;        // tiny skew oscillation
      el.style.transform = `translateZ(0) scaleX(${s.toFixed(5)}) scaleY(${(2 - s).toFixed(5)}) skewY(${sk.toFixed(4)}deg)`;
      idleRafRef.current = requestAnimationFrame(breathTick);
    };
    idleRafRef.current = requestAnimationFrame(breathTick);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 992px)');
    const handleViewportChange = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleViewportChange);

    // Kick a big jello on load so users notice it immediately
    const timeout = isMobile ? null : setTimeout(() => fireJello(1.2), 350);

    let lastScroll = window.scrollY;
    const handleScroll = () => {
      if (!isMobile && Math.abs(window.scrollY - lastScroll) > 40) {
        fireJello(0.8);
        lastScroll = window.scrollY;
      }
    };

    if (!isMobile) window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timeout) clearTimeout(timeout);
      mediaQuery.removeEventListener('change', handleViewportChange);
      window.removeEventListener('scroll', handleScroll);
      if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current);
    };
  }, [isMobile]);

  return (
    <section className="hero">
      <div
        ref={heroRef}
        className="liquidGlass-wrapper hero-card"
        style={{ willChange: 'transform' }}
        onMouseEnter={() => {
          if (!isMobile) fireJello(0.85);
        }}
        onTouchStart={() => {
          if (!isMobile) fireJello(1.0);
        }}
        onClick={() => fireJello(1.0)}
      >
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>

        <div className="liquidGlass-text">
          <img src="./images/chemicallogo.png" alt="Chemical Engineering Logo" className="hero-logo" />
          <h1>Department of<br /><span>Chemical Engineering</span></h1>
          <p>L.D. College of Engineering, Ahmedabad</p>
          <div className="hero-subtext">
            Pioneering chemical process education, industrial safety, and sustainable innovation for over 50 years.
          </div>

          <div className="hero-buttons">
            <a href="#/courses" className="btn btn-primary">Explore Programs →</a>
            <a href="#/notices" className="btn btn-outline">Latest Notices</a>
          </div>
        </div>
      </div>
    </section>
  );
};