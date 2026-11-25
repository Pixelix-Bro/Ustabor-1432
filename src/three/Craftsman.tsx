import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationMixer, Group, LoopRepeat, MathUtils } from 'three';
import type { SceneConfig } from '@/data/scenes';
import { TIMING } from '@/data/scenes';
import { progress } from '@/store/progress';
import { easing, remap } from '@/utils/webgl';
import { useNormalizedModel } from './useNormalizedModel';
import { useBrandDecal } from './useBrandDecal';

interface CraftsmanProps {
  scene: SceneConfig;
  index: number;
  /** load order (0 = hero) */
  order: number;
  isMobile: boolean;
  isTablet: boolean;
  reducedMotion: boolean;
  onReady?: (order: number) => void;
}

/**
 * One craftsman on the stage. Reads the global scroll progress each frame and
 * positions itself for its enter / hold / exit window. Outside its window the
 * group is hidden so it costs nothing to render.
 */
function CraftsmanImpl({ scene, index, order, isMobile, isTablet, reducedMotion, onReady }: CraftsmanProps) {
  const model = useNormalizedModel(scene.model!);
  const { group, gltf } = model;
  useBrandDecal(model, scene.decal);
  const root = useRef<Group>(null);
  const mixer = useMemo(() => (gltf.animations.length ? new AnimationMixer(gltf.scene) : null), [gltf]);

  const placement = useMemo(() => {
    const base = scene.placement!;
    const m = isMobile ? base.mobile : isTablet ? base.tablet : undefined;
    return {
      scale: m?.scale ?? base.scale,
      position: m?.position ?? base.position,
      rotationY: m?.rotationY ?? base.rotationY,
    };
  }, [scene, isMobile, isTablet]);

  // Embedded animation (hero only) – a slow, natural idle.
  useEffect(() => {
    if (!mixer) return;
    const clip = gltf.animations[scene.animationIndex ?? 0];
    if (!clip) return;
    const action = mixer.clipAction(clip);
    action.setLoop(LoopRepeat, Infinity);
    action.timeScale = 0.9;
    action.play();
    return () => {
      action.stop();
      mixer.uncacheClip(clip);
    };
  }, [mixer, gltf, scene.animationIndex]);

  useEffect(() => {
    onReady?.(order);
  }, [onReady, order]);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const p = progress.smooth;
    const t = p - index;
    const { HOLD, EXIT_END, ENTER_START } = TIMING;

    // Visibility window
    if (t < -ENTER_START || t > EXIT_END) {
      g.visible = false;
      return;
    }
    g.visible = true;
    if (mixer && !reducedMotion) mixer.update(Math.min(delta, 1 / 30));

    // Conveyor choreography: every craftsman arrives from the right and leaves
    // to the left, so two characters never cross on the same side.
    const dir = scene.exitDirection ?? -1;
    const enterDir = scene.enterDirection ?? 1;
    const time = state.clock.elapsedTime;

    let x = 0;
    let y = 0;
    let z = 0;
    let rotY = 0;
    let s = 1;

    if (t < -HOLD) {
      // entering: slide in from the side & back, un-rotate, grow
      const k = easing.easeOutCubic(remap(t, -ENTER_START, -HOLD));
      const inv = 1 - k;
      x = enterDir * (isMobile ? 1.6 : 2.6) * inv;
      z = -1.4 * inv;
      y = -0.35 * inv;
      rotY = enterDir * 0.9 * inv;
      s = 0.8 + 0.2 * k;
    } else if (t > HOLD) {
      // exiting: slide out to the side & down, rotate away, shrink
      const k = easing.easeInCubic(remap(t, HOLD, EXIT_END));
      x = dir * (isMobile ? 1.7 : 2.8) * k;
      z = -1.0 * k;
      y = -0.5 * k;
      rotY = dir * 0.8 * k;
      s = 1 - 0.2 * k;
    }

    // Subtle life while holding (and blending through transitions)
    const hold = 1 - Math.min(1, Math.abs(t) / EXIT_END);
    const idleRot = reducedMotion ? 0 : Math.sin(time * 0.45 + index) * 0.06 * hold;
    const idleBob = reducedMotion || mixer ? 0 : Math.sin(time * 0.9 + index * 2) * 0.012 * hold;

    // Gentle scroll-coupled turn: character faces slightly toward scroll direction
    const scrollTurn = MathUtils.clamp(t, -1, 1) * 0.25;

    // Pointer parallax (desktop only)
    const px = isMobile ? 0 : progress.pointer.x * 0.12;

    g.position.set(
      placement.position[0] + x,
      placement.position[1] + y + idleBob,
      placement.position[2] + z,
    );
    g.rotation.set(0, placement.rotationY + rotY + idleRot + scrollTurn + px, 0);
    g.scale.setScalar(placement.scale * s);
  });

  return <primitive ref={root} object={group} visible={false} />;
}

/** Memoised: the Experience re-renders as models load, the craftsmen need not. */
export const Craftsman = memo(CraftsmanImpl);
