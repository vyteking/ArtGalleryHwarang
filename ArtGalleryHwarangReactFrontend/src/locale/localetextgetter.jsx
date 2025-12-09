import { useLocale } from './localeoptions';
import i18next from 'i18next';
import { Trans, useTranslation } from 'react-i18next'

export function getPluralForm( {name} ) {
  
}


export function GetDir() {
  const { direction } = useLocale();
  return direction;
}

// Kept for compatibility if you use it to get a whole section
export function useLang(section) {
  const { localeTxt: texts } = useLocale();
  return texts?.[section] || {};
}