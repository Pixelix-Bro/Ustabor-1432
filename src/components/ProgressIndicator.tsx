import { useT } from '@/i18n/LanguageProvider';
import { STORY_SCENES } from '@/data/scenes';
import { useSceneIndex } from '@/hooks/useSceneIndex';

const pad = (n: number) => String(n).padStart(2, '0');

/** "01 / 05" + profession, visible while a story scene is active. */
export function ProgressIndicator() {
  const t = useT();
  const index = useSceneIndex();
  const total = STORY_SCENES.length;
  const storyIndex = Math.min(Math.max(index, 1), total); // 1..total
  const visible = index >= 1 && index <= total;
  const scene = STORY_SCENES[storyIndex - 1];
  return (
    <div className={`indicator${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <div className="indicator__num">
        {pad(storyIndex)} <span>{t.indicator.of} {pad(total)}</span>
      </div>
      <div className="indicator__bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${storyIndex / total})` }} />
      </div>
      <div className="indicator__label">{t.scenes[scene.copyKey!].title}</div>
    </div>
  );
}
