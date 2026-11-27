import { CAMERA, SCENES } from '@/data/scenes'
import { progress } from '@/store/progress'
import { isLowPowerDevice } from '@/utils/webgl'
import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { NoToneMapping, SRGBColorSpace } from 'three'
import { CameraRig } from './CameraRig'
import { Craftsman } from './Craftsman'
import { Lighting } from './Lighting'
import { preloadModel } from './useNormalizedModel'

const MODEL_SCENES = SCENES.map((s, i) => ({ s, i })).filter(({ s }) => s.model)

interface ExperienceProps {
  isMobile: boolean
  isTablet: boolean
  reducedMotion: boolean
  onHeroReady: () => void
}

/**
 * The 3D stage. Loads the hero model first (gates the intro), then warms the
 * remaining models in order so each profession is ready before it is reached.
 */
export function Experience({ isMobile, isTablet, reducedMotion, onHeroReady }: ExperienceProps) {
  const lowPower = useMemo(() => isLowPowerDevice() || isMobile, [isMobile])
  const [heroReady, setHeroReady] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)

  const handleHeroReady = useCallback(() => {
    if (!heroReady) {
      setHeroReady(true)
      onHeroReady()
    }
  }, [heroReady, onHeroReady])

  useEffect(() => {
    if (!heroReady) return
    MODEL_SCENES.slice(1).forEach(({ s }) => preloadModel(s.model!))
  }, [heroReady])

  // Progressive loading: each model is mounted (and therefore fetched) only
  // after the previous one has rendered, so the first paint stays fast and
  // the professions are ready before the visitor scrolls to them.
  const handleModelReady = useCallback(
    (order: number) => {
      if (order === 0) handleHeroReady()
      setLoadedCount((c) => Math.max(c, order + 1))
    },
    [handleHeroReady]
  )

  // Pointer parallax source
  useEffect(() => {
    if (isMobile) return
    const onMove = (e: PointerEvent) => {
      progress.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      progress.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [isMobile])

  return (
    <Canvas
      className="stage__canvas"
      dpr={[1, lowPower ? 1.5 : 2]}
      shadows={!lowPower}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: NoToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      camera={{
        position: isMobile ? CAMERA.mobile.position : CAMERA.position,
        fov: isMobile ? CAMERA.mobile.fov : CAMERA.fov,
        near: 0.1,
        far: 40,
      }}
      flat
      frameloop="always"
    >
      <CameraRig isMobile={isMobile} reducedMotion={reducedMotion} />
      <Lighting lowPower={lowPower} />
      {MODEL_SCENES.map(({ s, i }, order) => {
        // Mount the next model only once the previous one is on screen.
        if (order > loadedCount) return null
        return (
          <Suspense key={s.id} fallback={null}>
            <Craftsman
              scene={s}
              index={i}
              order={order}
              isMobile={isMobile}
              isTablet={isTablet}
              reducedMotion={reducedMotion}
              onReady={handleModelReady}
            />
          </Suspense>
        )
      })}
      <Preload all />
    </Canvas>
  )
}
