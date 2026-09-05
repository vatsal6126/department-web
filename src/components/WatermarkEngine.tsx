import React, { useEffect, useState } from 'react';

interface Watermark {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: string;
}

export const WatermarkEngine: React.FC = () => {
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);

  useEffect(() => {
    const generateOrganicWatermarks = () => {
      const pageWidth = document.documentElement.clientWidth || window.innerWidth;
      const pageHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      );

      const isMobile = pageWidth <= 992;

      const logoEl = document.querySelector('.hero-logo');
      let logoBounds: { left: number; right: number; top: number; bottom: number } | null = null;
      if (logoEl) {
        const rect = logoEl.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        logoBounds = {
          left: rect.left + scrollX - 25,
          right: rect.right + scrollX + 25,
          top: rect.top + scrollY - 25,
          bottom: rect.bottom + scrollY + 25,
        };
      }

      const elementConfigs = [
        { src: 'images/element1.svg', minScale: 1.9, maxScale: 5.9, minRot: 0, maxRot: 360 },
        { src: 'images/element2.svg', minScale: 1.9, maxScale: 3.2, minRot: -10, maxRot: 10 },
        { src: 'images/element3.svg', minScale: 1.9, maxScale: 5.5, minRot: 0, maxRot: 360 },
        { src: 'images/element4.svg', minScale: 1.9, maxScale: 4.4, minRot: -5, maxRot: 5 },
        { src: 'images/element5.svg', minScale: 1.9, maxScale: 5.5, minRot: 0, maxRot: 360 },
      ];

      const placedPoints: { x: number; y: number; typeIdx: number; itemWidth: number }[] = [];
      const newWatermarks: Watermark[] = [];

      function isValidPlacement(x: number, y: number, typeIdx: number, itemWidth: number) {
        if (x < 10 || x > pageWidth - itemWidth - 10 || y < 65 || y > pageHeight - itemWidth - 20) {
          return false;
        }

        if (logoBounds) {
          if (
            x + itemWidth > logoBounds.left &&
            x < logoBounds.right &&
            y + itemWidth > logoBounds.top &&
            y < logoBounds.bottom
          ) {
            return false;
          }
        }

        for (let i = 0; i < placedPoints.length; i++) {
          const pt = placedPoints[i];
          const dx = pt.x - x;
          const dy = pt.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const dynamicMinDist = Math.max(
            isMobile ? 70 : 150,
            (itemWidth + pt.itemWidth) * (isMobile ? 0.65 : 0.95)
          );
          const dynamicMaxDist = dynamicMinDist * 1.4;

          if (dist < dynamicMinDist) return false;
          if (pt.typeIdx === typeIdx && dist < dynamicMaxDist) return false;
        }

        return true;
      }

      // Dynamically scale max attempt density based on available screen area width
      // Full screen desktop (~1920px) gets ~1200 attempts, smaller windows scale down proportionally to avoid crowding
      const screenFactor = Math.min(pageWidth / 1920, 1);
      const maxAttempts = isMobile ? 600 : Math.max(400, Math.floor(1200 * screenFactor));
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts++;
        const typeIdx = Math.floor(Math.random() * elementConfigs.length);
        const config = elementConfigs[typeIdx];

        const scale = parseFloat((Math.random() * (config.maxScale - config.minScale) + config.minScale).toFixed(2));
        const rotation = (Math.random() * (config.maxRot - config.minRot) + config.minRot).toFixed(1);

        const baseWidth = isMobile ? Math.min(32, pageWidth * 0.08) : 50;
        const currentItemWidth = baseWidth * scale;

        const x = Math.floor(Math.random() * (pageWidth - currentItemWidth - 20)) + 10;
        const y = Math.floor(Math.random() * (pageHeight - currentItemWidth - 40)) + 65;

        if (isValidPlacement(x, y, typeIdx, currentItemWidth)) {
          placedPoints.push({ x, y, typeIdx, itemWidth: currentItemWidth });
          newWatermarks.push({
            id: `wm-${attempts}-${x}-${y}`,
            src: config.src,
            x,
            y,
            width: currentItemWidth,
            rotation,
          });
        }
      }

      setWatermarks(newWatermarks);
    };

    // Initial render generation
    if (document.readyState === 'complete') {
      generateOrganicWatermarks();
    } else {
      window.addEventListener('load', generateOrganicWatermarks, { once: true });
    }

    // Debounced desktop resize listener with density scaling
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      
      // ONLY trigger on Desktop (> 992px) and if width changed significantly (prevent minor scrollbar layout noise)
      if (currentWidth > 992 && Math.abs(currentWidth - lastWidth) > 30) {
        lastWidth = currentWidth;
        if (resizeTimer) clearTimeout(resizeTimer);
        
        // Wait 300ms after user stops resizing before re-scattering with adjusted density
        resizeTimer = setTimeout(() => {
          generateOrganicWatermarks();
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('load', generateOrganicWatermarks);
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="watermark-container" aria-hidden="true">
      {watermarks.map((wm) => (
        <img
          key={wm.id}
          src={wm.src}
          className="wm"
          alt=""
          decoding="async"
          style={{
            left: `${wm.x}px`,
            top: `${wm.y}px`,
            width: `${wm.width}px`,
            transform: `rotate(${wm.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};