import { useLocale } from './localeoptions';
import type { LocaleTexts } from './locale.types';
import type { Direction } from '../ui/orientation/orientationoptions';

export function getPluralForm({ name: _name }: { name: string }): void {
  // TODO: implement plural form logic
}

export function GetDir(): Direction {
  const { direction } = useLocale();
  return direction;
}

// Returns a specific section of the locale texts by key
export function useLang<K extends keyof LocaleTexts>(section: K): LocaleTexts[K] {
  const { localeTxt } = useLocale();
  return localeTxt[section];
}
