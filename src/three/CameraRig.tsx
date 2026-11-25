import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { CAMERA, TIMING } from '@/data/scenes';
import { progress } from '@/store/progress';

const target = new Vector3();

interface CameraRigProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

/**
 * Smooths the raw scroll progress (so the 3D layer never stutters with the
 * scroll wheel) and performs gentle camera moves: a dolly during transitions
 * and a pointer-driven parallax on desktop.
 */
export function CameraRig({ isMobile, reducedMotion }: CameraRigProps) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const lastFov = useRef(0);

  useFrame((_, delta) => {
    // Smooth progress (frame-rate independent)
    const k = 1 - Math.exp(-delta * (reducedMotion ? 30 : 9));
    progress.smooth = MathUtils.lerp(progress.smooth, progress.p, k);

    const cfg = isMobile ? CAMERA.mobile : CAMERA;
    const p = progress.smooth;
    const frac = p - Math.round(p); // -0.5 .. 0.5
    // transition intensity: 0 while holding, 1 mid-transition
    const trans = MathUtils.smoothstep(Math.abs(frac), TIMING.HOLD, 0.5);

    // Pointer parallax (desktop)
    const px = isMobile ? 0 : progress.pointer.x;
    const py = isMobile ? 0 : progress.pointer.y;

    const dolly = reducedMotion ? 0 : trans * 0.7;
    const desired = target.set(
      cfg.position[0] + px * 0.18,
      cfg.position[1] + py * 0.08 + trans * 0.12,
      cfg.position[2] + dolly,
    );
    camera.position.lerp(desired, 1 - Math.exp(-delta * 6));
    camera.lookAt(cfg.target[0], cfg.target[1] + trans * 0.05, cfg.target[2]);

    // Keep the character framed on narrow / short viewports
    const aspect = size.width / size.height;
    let fov = cfg.fov;
    if (aspect < 0.9) fov = cfg.fov + (0.9 - aspect) * (isMobile ? 10 : 18);
    if (fov !== lastFov.current) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
      lastFov.current = fov;
    }
  });

  return null;
}
