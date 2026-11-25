import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { SCENES } from '@/data/scenes';
import { useNormalizedModel } from '@/three/useNormalizedModel';
import { useBrandDecal } from '@/three/useBrandDecal';
import type { SceneConfig } from '@/data/scenes';
import { Lighting } from '@/three/Lighting';
import { progress } from '@/store/progress';

/**
 * Dev-only model inspector: `/?lab&model=/models/pete.glb`
 * Shows the normalised character (1 unit tall) on a grid with free orbit.
 */
function LabModel({ path, rotY, scene }: { path: string; rotY: number; scene?: SceneConfig }) {
  const model = useNormalizedModel(path);
  const { group, rawSize, gltf } = model;
  useBrandDecal(model, scene?.decal);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[lab]', path, 'raw size', rawSize.toArray().map((v) => v.toFixed(2)), 'anims', gltf.animations.map((a) => `${a.name} ${a.duration.toFixed(2)}s`));
  }, [path, rawSize, gltf]);
  return <primitive object={group} rotation={[0, rotY, 0]} scale={1.85} />;
}

export default function ModelLab() {
  const params = new URLSearchParams(window.location.search);
  const [path, setPath] = useState(params.get('model') ?? SCENES[0].model!);
  const [rotY, setRotY] = useState(Number(params.get('rot') ?? 0));
  // `?focus=y` moves the camera close to that height (in scene units) for inspecting details
  const focus = params.get('focus') ? Number(params.get('focus')) : null;
  const camPos: [number, number, number] = focus !== null ? [0, focus, 1.3] : [0, 1.05, 4.6];
  const camTarget: [number, number, number] = focus !== null ? [0, focus, 0] : [0, 0.92, 0];
  progress.ready = true;
  progress.smooth = 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e4dc' }}>
      <div style={{ position: 'absolute', zIndex: 2, top: 12, left: 12, display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: 'monospace' }}>
        {SCENES.filter((s) => s.model).map((s) => (
          <button key={s.id} onClick={() => setPath(s.model!)} style={{ padding: '6px 10px', background: path === s.model ? '#F2A900' : '#fff' }}>
            {s.id}
          </button>
        ))}
        <input type="range" min={-3.14} max={3.14} step={0.05} value={rotY} onChange={(e) => setRotY(Number(e.target.value))} />
        <span>{rotY.toFixed(2)}</span>
      </div>
      <Canvas shadows camera={{ position: camPos, fov: 30 }} gl={{ antialias: true }} flat>
        <Lighting lowPower={false} />
        <Suspense fallback={null}>
          <LabModel path={path} rotY={rotY} scene={SCENES.find((s) => s.model === path)} />
        </Suspense>
        <Grid args={[10, 10]} cellColor="#bbb" sectionColor="#999" fadeDistance={12} />
        <OrbitControls target={camTarget} />
      </Canvas>
    </div>
  );
}
