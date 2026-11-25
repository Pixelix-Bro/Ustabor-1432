import { forwardRef } from 'react';
import type { SceneConfig } from '@/data/scenes';
import { useT } from '@/i18n/LanguageProvider';

interface SceneLayerProps {
  scene: SceneConfig;
  index: number;
  /** 1-based number among story scenes, for "01" labels */
  number: number;
  staticMode?: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A profession scene: editorial composition around the central character.
 * Title block on one side, the services index on the other; the side
 * alternates per scene via `scene.layout`.
 */
export const SceneLayer = forwardRef<HTMLDivElement, SceneLayerProps>(function SceneLayer(
  { scene, index, number, staticMode },
  ref,
) {
  const t = useT();
  const copy = t.scenes[scene.copyKey!];
  const layout = scene.layout ?? 'title-left';
  return (
    <div
      ref={ref}
      className={`layer layer--story layer--${layout}${staticMode ? ` layer--static-theme-${scene.theme.mode}` : ''}`}
      data-layer={index}
      id={index === 1 ? 'services' : undefined}
      style={staticMode ? { background: scene.theme.bg } : undefined}
    >
      <div className={`layer__col layer__col--title ${layout === 'title-left' ? 'layer__col--left' : 'layer__col--right'}`}>
        <div className="scene-index" aria-hidden="true" data-anim>
          {pad(number)}
        </div>
        <h2 className="display scene-title" data-anim>
          {copy.title}
        </h2>
        <p className="lede scene-desc" data-anim>
          {copy.description}
        </p>
      </div>

      <div className={`layer__col layer__col--services ${layout === 'title-left' ? 'layer__col--right' : 'layer__col--left'}`}>
        <ul className="services" aria-label={copy.title}>
          {copy.services.map((name, i) => (
            <li className="services__item" key={i} data-anim>
              <span className="services__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="services__name">{name}</span>
            </li>
          ))}
        </ul>
        {copy.note && (
          <p className="scene-note" data-anim>
            {copy.note}
          </p>
        )}
      </div>
    </div>
  );
});
