
import React, { useEffect, useRef } from 'react';
import { Particle, AppState } from '../types';

interface ExtendedParticle extends Particle {
  phase: number;
  type: 'tree' | 'star' | 'ripple' | 'snow';
  baseRadius?: number;
}

interface ParticleSystemProps {
  state: AppState;
  userName: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ExtendedParticle[]>([]);
  const requestRef = useRef<number>();
  const rotationY = useRef(0);

  const createPoints = (count: number) => {
    const pts: ExtendedParticle[] = [];
    
    // 1. Layered Conical Tree (Warm Pink/Gold/White)
    // Tapering to the top (Corrected Orientation)
    const treeCount = count * 0.75;
    const layers = 10;
    for (let i = 0; i < treeCount; i++) {
      const progress = i / treeCount; // 0 = base, 1 = top
      
      // y goes from -200 (bottom) to 250 (top)
      const y = -200 + progress * 450;
      // radius is largest at base (progress 0) and smallest at top (progress 1)
      const taper = Math.pow(1 - progress, 0.85); 
      const radius = 220 * taper;
      
      // Add a bit of "layering" step effect
      const layerStep = Math.floor(progress * layers) / layers;
      const stepRadius = radius * (0.9 + Math.random() * 0.2);

      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * stepRadius;
      const z = Math.sin(angle) * stepRadius;

      // Color logic: Warm Pink -> Gold -> White
      let color;
      const colorRand = Math.random();
      if (colorRand > 0.85) color = `hsl(0, 0%, 100%)`; // White
      else if (colorRand > 0.45) color = `hsl(${335 + Math.random() * 20}, 85%, 70%)`; // Pink/Rose
      else color = `hsl(${45 + Math.random() * 10}, 95%, 65%)`; // Warm Gold

      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: (Math.random() - 0.5) * 1000,
        targetX: x,
        targetY: y, // Upwards relative to center
        targetZ: z,
        vx: 0, vy: 0, vz: 0,
        size: Math.random() * 1.8 + 1,
        color,
        opacity: Math.random() * 0.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        type: 'tree'
      });
    }

    // 2. The Star (Top Globe) - Positioned at tree top (y=250)
    const starCount = count * 0.1;
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.random() * 30;
      
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: (Math.random() - 0.5) * 500,
        targetX: r * Math.sin(phi) * Math.cos(theta),
        targetY: 260 + r * Math.cos(phi), // At the top
        targetZ: r * Math.sin(phi) * Math.sin(theta),
        vx: 0, vy: 0, vz: 0,
        size: Math.random() * 2.5 + 1.5,
        color: '#ffffff',
        opacity: 1,
        phase: Math.random() * Math.PI * 2,
        type: 'star'
      });
    }

    // 3. Base Ripples (Circular energy fields) - Positioned at tree base (y=-200)
    const rippleCount = count * 0.15;
    for (let i = 0; i < rippleCount; i++) {
      const rippleLayer = Math.floor(Math.random() * 4);
      const baseR = 120 + rippleLayer * 90;
      const angle = Math.random() * Math.PI * 2;
      
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: (Math.random() - 0.5) * 500,
        targetX: Math.cos(angle) * baseR,
        targetY: -210, // At the base
        targetZ: Math.sin(angle) * baseR,
        vx: 0, vy: 0, vz: 0,
        size: Math.random() * 1.5 + 0.5,
        color: '#ffffff',
        opacity: 0.5,
        phase: Math.random() * Math.PI * 2,
        type: 'ripple',
        baseRadius: baseR
      });
    }

    return pts;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    particles.current = createPoints(4500);

    const render = () => {
      ctx.fillStyle = '#020617'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;

      rotationY.current += 0.012;
      const cosRY = Math.cos(rotationY.current);
      const sinRY = Math.sin(rotationY.current);

      particles.current.forEach((p) => {
        if (state === 'input') {
          // Floating background stars (White dots)
          p.vy += 0.03;
          if (p.y > canvas.height) p.y = -20;
          p.x += Math.sin(time + p.phase) * 0.3;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.15;
          ctx.fill();
        } else {
          let tx = p.targetX;
          let ty = p.targetY;
          let tz = p.targetZ;

          if (p.type === 'ripple' && p.baseRadius) {
            const expand = (time * 60 + p.phase * 25) % 180;
            const currentR = p.baseRadius + expand;
            const angle = Math.atan2(p.targetZ, p.targetX);
            tx = Math.cos(angle) * currentR;
            tz = Math.sin(angle) * currentR;
            p.opacity = 1 - (expand / 180);
          }

          const rx = tx * cosRY - tz * sinRY;
          const rz = tx * sinRY + tz * cosRY;

          const dx = (centerX + rx) - p.x;
          const dy = (centerY - ty) - p.y; // centerY - ty: positive ty is higher
          const dz = rz - p.z;

          p.vx += dx * 0.04;
          p.vy += dy * 0.04;
          p.vz += dz * 0.04;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.vz *= 0.86;

          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          const perspective = 1000 / (1000 + p.z);
          const drawSize = p.size * perspective * (p.type === 'star' ? (1.3 + Math.sin(time * 6 + p.phase) * 0.3) : 1);

          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          
          const flicker = p.type === 'tree' ? (0.55 + Math.sin(time * 4 + p.phase) * 0.45) : 1;
          ctx.globalAlpha = p.opacity * flicker;
          ctx.fill();

          if (p.type === 'star' || (p.type === 'tree' && Math.random() > 0.985)) {
            ctx.shadowBlur = 18 * perspective;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      ctx.globalAlpha = 1.0;
      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [state]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ background: '#020617' }} />;
};

export default ParticleSystem;
