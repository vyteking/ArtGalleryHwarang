import { useLocale } from './localeoptions';

export function GetDir() {
  const { localeinfo } = useLocale();
  return localeinfo?.direction;
}

export function GetText(txt) {
  const { text } = useLocale();
}

export function useLang(section) {
  const { texts } = useLocale();
  return texts?.[section] || {};
}