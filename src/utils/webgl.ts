/** Feature detection for the 3D stage with a graceful static fallback. */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/** Rough "weak device" heuristic used to lower rendering cost. */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  return cores <= 4 || memory <= 4;
}

export const easing = {
  smoothstep: (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  },
  easeInOutCubic: (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },
  easeOutCubic: (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3),
  easeInCubic: (t: number) => Math.pow(Math.min(1, Math.max(0, t)), 3),
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  outMin + ((clamp(v, Math.min(inMin, inMax), Math.max(inMin, inMax)) - inMin) / (inMax - inMin)) * (outMax - outMin);
