import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DirectionalLight, HemisphereLight, MathUtils, PointLight } from 'three';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { SCENES } from '@/data/scenes';
import { progress } from '@/store/progress';
import { clamp } from '@/utils/webgl';

const tmpA = new Color();
const tmpB = new Color();

/** Interpolates a theme colour across scenes for the current progress. */
function themeColorAt(p: number, key: 'keyLight' | 'fillLight' | 'glow', out: Color) {
  const i = clamp(Math.floor(p), 0, SCENES.length - 1);
  const j = clamp(i + 1, 0, SCENES.length - 1);
  const f = clamp(p - i, 0, 1);
  tmpA.set(SCENES[i].theme[key]);
  tmpB.set(SCENES[j].theme[key]);
  out.copy(tmpA).lerp(tmpB, f);
  return out;
}

interface LightingProps {
  lowPower: boolean;
}

/**
 * Studio-style three-point lighting that tints itself with the active scene
 * theme, plus a soft contact shadow so the character feels grounded.
 */
export function Lighting({ lowPower }: LightingProps) {
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const glow = useRef<PointLight>(null);

  useFrame(() => {
    const p = progress.smooth;
    if (key.current) themeColorAt(p, 'keyLight', key.current.color);
    if (fill.current) themeColorAt(p, 'fillLight', fill.current.color);
    if (hemi.current) {
      themeColorAt(p, 'keyLight', hemi.current.color);
      themeColorAt(p, 'glow', hemi.current.groundColor);
    }
    if (glow.current) {
      themeColorAt(p, 'glow', glow.current.color);
      // dark scenes lean on the floor glow more
      const i = clamp(Math.round(p), 0, SCENES.length - 1);
      const target = SCENES[i].theme.mode === 'dark' ? 6 : 1.5;
      glow.current.intensity = MathUtils.lerp(glow.current.intensity, target, 0.05);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} intensity={0.9} color="#ffffff" groundColor="#d8cfbf" />
      <directionalLight
        ref={key}
        position={[2.6, 4.2, 3.2]}
        intensity={2.4}
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
      />
      <directionalLight ref={fill} position={[-3.5, 2.2, 1.5]} intensity={0.9} />
      <directionalLight position={[0, 3.5, -4]} intensity={1.6} color="#ffffff" />
      <pointLight ref={glow} position={[0, 0.25, 0.4]} intensity={1.5} distance={3.5} decay={2} />

      {/* Procedural studio environment – no external HDR download */}
      <Environment resolution={lowPower ? 64 : 128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, -4]} scale={[8, 4, 1]} color="#fff6e8" />
        <Lightformer form="rect" intensity={1.4} position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#dfe8ff" />
        <Lightformer form="rect" intensity={1.0} position={[5, 1.5, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#ffe3b3" />
        <Lightformer form="ring" intensity={0.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={6} color="#ffffff" />
      </Environment>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={lowPower ? 0.35 : 0.5}
        scale={6}
        blur={2.4}
        far={2.2}
        resolution={lowPower ? 256 : 512}
        frames={Infinity}
        color="#0b1430"
      />
    </>
  );
}
