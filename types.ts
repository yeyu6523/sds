
export interface Particle {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  opacity: number;
}

export type AppState = 'input' | 'transition' | 'display';

export interface BlessingData {
  text: string;
  sender: string;
}
