import { useEffect, useMemo } from 'react';
import { Box3, Group, Mesh, MeshStandardMaterial, Vector3, type Material, type Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

export interface NormalizedModel {
  /** Wrapper group: feet at y=0, centred on x/z, height = 1 unit */
  group: Group;
  gltf: GLTF;
  /** Original bounding box size in model units */
  rawSize: Vector3;
}

/**
 * Loads a GLB (meshopt-compressed) and wraps its scene in a group that is
 * normalised to a 1-unit tall character standing at the origin. Every source
 * model has a different scale / origin / up-axis, so this is the single place
 * where those differences are absorbed.
 *
 * Skinned meshes are measured in their bind pose (bounding box of the
 * skinned geometry), which is good enough for placement.
 */
export function useNormalizedModel(path: string): NormalizedModel {
  const gltf = useGLTF(path, false, true) as unknown as GLTF;

  const model = useMemo<NormalizedModel>(() => {
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);

    // Measure the model. For skinned meshes, Box3.setFromObject uses the
    // geometry bounding box transformed by the mesh matrix, which matches
    // the bind pose for Mixamo-style rigs.
    const box = new Box3().setFromObject(scene, true);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    const height = size.y || 1;
    const scale = 1 / height;

    const group = new Group();
    group.name = `normalized:${path}`;
    const inner = new Group();
    inner.name = 'inner';
    inner.add(scene);
    inner.scale.setScalar(scale);
    inner.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    group.add(inner);

    // Material hygiene: enable shadows, keep textures crisp, avoid
    // double-sided transparent sorting issues on hair/eyelash cards.
    scene.traverse((obj: Object3D) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m: Material) => {
        const std = m as MeshStandardMaterial;
        if (std.map) std.map.anisotropy = 4;
        if (std.transparent) {
          // Sketchfab flags many opaque parts as BLEND. Keep alpha for hair /
          // eyelash cards but write depth and clip low alpha so sorting
          // artefacts never show through the character.
          std.depthWrite = true;
          std.alphaTest = Math.max(std.alphaTest, 0.25);
        }
      });
    });

    return { group, gltf, rawSize: size };
  }, [gltf, path]);

  useEffect(() => {
    return () => {
      /* geometries/textures are cached by useGLTF; nothing to dispose here */
    };
  }, []);

  return model;
}

export const preloadModel = (path: string) => useGLTF.preload(path, false, true);
