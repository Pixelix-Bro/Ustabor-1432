import { useEffect, useMemo } from 'react';
import {
  DoubleSide,
  Euler,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  SRGBColorSpace,
  Texture,
  Vector3,
} from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { useTexture } from '@react-three/drei';
import type { NormalizedModel } from './useNormalizedModel';

export const BRAND_BADGE_TEXTURE = '/brand/logo-badge.png';

/**
 * Where the UstaBor badge is projected onto a character, in normalised
 * character space (feet at y = 0, height = 1, the character facing +Z).
 */
export interface DecalSpec {
  /** Horizontal offset – negative is the character's right side (viewer's left) */
  x: number;
  /** Height on the body, 0..1 */
  y: number;
  /** Badge width in character heights (0.1 ≈ a hand-sized patch) */
  size: number;
  /** Which way the character faces in its source file (+1 = +Z, -1 = -Z) */
  facing?: 1 | -1;
  /** Extra roll of the badge in radians (to follow a slanted pocket) */
  roll?: number;
  /** Projection depth; keep small so the badge does not bleed onto limbs */
  depth?: number;
  /** Only project onto meshes whose name or material name contains this (case-insensitive) */
  meshMatch?: string;
}

/** Horizontal offsets tried around `x` until the ray hits the target. */
const SEARCH_OFFSETS = [0, -0.03, 0.03, -0.06, 0.06, -0.1, 0.1, -0.15, 0.15, -0.2, 0.2, -0.3, 0.3];

const raycaster = new Raycaster();
const identity = new Matrix4();

/**
 * Projects the brand badge onto the character's clothing. A ray from the
 * front finds the exact surface point and normal, a DecalGeometry wraps the
 * badge onto that surface, and the result is attached to the normalised
 * wrapper so it moves, rotates and scales with the character.
 */
export function useBrandDecal(model: NormalizedModel, spec: DecalSpec | undefined) {
  const texture = useTexture(BRAND_BADGE_TEXTURE) as Texture;

  const decal = useMemo(() => {
    if (!spec) return null;
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;

    const { group } = model;
    const facing = spec.facing ?? 1;

    // Measure in normalised space: neutralise whatever transform the wrapper
    // currently has, compute, then let the next frame restore it.
    const savedWorld = group.matrixWorld.clone();
    group.matrixWorld.copy(identity);
    group.children.forEach((c) => c.updateMatrixWorld(true));

    // Candidate surfaces: every mesh, or only the ones matching `meshMatch`.
    const match = spec.meshMatch?.toLowerCase();
    const candidates: Mesh[] = [];
    group.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh || m.name === 'brand-decal') return;
      if (match) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        const names = [m.name, ...mats.map((mat) => mat?.name ?? '')].join(' ').toLowerCase();
        if (!names.includes(match)) return;
      }
      candidates.push(m);
    });

    let hit: ReturnType<Raycaster['intersectObjects']>[number] | undefined;
    for (const dx of SEARCH_OFFSETS) {
      raycaster.set(new Vector3(spec.x + dx, spec.y, 3 * facing), new Vector3(0, 0, -facing));
      hit = raycaster.intersectObjects(candidates, false).find((h) => h.face);
      if (hit) break;
    }
    if (!hit || !hit.face) {
      group.matrixWorld.copy(savedWorld);
      return null;
    }

    const target = hit.object as Mesh;
    const normal = hit.face.normal.clone().transformDirection(target.matrixWorld);
    // Blend the surface normal with the straight-on direction so a badge on a
    // curved chest still reads flat and undistorted.
    normal.lerp(new Vector3(0, 0, facing), 0.5).normalize();

    const helper = new Object3D();
    helper.position.copy(hit.point);
    helper.lookAt(hit.point.clone().add(normal));
    helper.rotateZ(spec.roll ?? 0);
    const orientation = new Euler().copy(helper.rotation);

    const w = spec.size;
    const h = spec.size * (texture.image ? texture.image.height / texture.image.width : 1.09);
    const size = new Vector3(w, h, spec.depth ?? 0.08);
    const geometry = new DecalGeometry(target, hit.point, orientation, size);

    const material = new MeshStandardMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      roughness: 0.85,
      metalness: 0,
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = 'brand-decal';
    mesh.renderOrder = 2;
    mesh.frustumCulled = false;
    group.add(mesh);
    group.matrixWorld.copy(savedWorld);
    return mesh;
  }, [model, spec, texture]);

  useEffect(() => {
    return () => {
      if (!decal) return;
      decal.removeFromParent();
      decal.geometry.dispose();
      (decal.material as MeshStandardMaterial).dispose();
    };
  }, [decal]);

  return decal;
}

/** Lets a Group with a decal be reused without a stale badge. */
export function removeBrandDecal(group: Group) {
  group.children.filter((c) => c.name === 'brand-decal').forEach((c) => c.removeFromParent());
}

export const preloadBrandBadge = () => useTexture.preload(BRAND_BADGE_TEXTURE);
