import { useCallback } from 'react';
import { useLocale } from './localeoptions';
import i18n from '../i18n';
import type { LocaleTexts, PluralForm } from './locale.types';
import type { Direction } from '../ui/orientation/orientationoptions';

const pluralRulesCache = new Map<string, Intl.PluralRules>();

function getPluralRules(tag: string): Intl.PluralRules {
  let rules = pluralRulesCache.get(tag);
  if (!rules) {
    rules = new Intl.PluralRules(tag);
    pluralRulesCache.set(tag, rules);
  }
  return rules;
}

function selectPluralCategory(localeCode: string, count: number): Intl.LDMLPluralRule {
  const candidates = [
    localeCode,
    localeCode.split('-')[0],
    ...(i18n.languages ?? []),
  ];

  for (const tag of candidates) {
    try {
      return getPluralRules(tag).select(count);
    } catch {
      continue;
    }
  }
  return 'other';
}

export function getPluralForm(forms: PluralForm, count: number, localeCode: string): string {
  const category = selectPluralCategory(localeCode, count);
  const template = forms[category] ?? forms.other;
  return template.replaceAll('{{count}}', String(count));
}

export function usePluralForm() {
  const { currentLocale } = useLocale();
  const code = currentLocale.LocaleInfo.code;
  return useCallback(
    (forms: PluralForm, count: number) => getPluralForm(forms, count, code),
    [code]
  );
}

// advanced codebase. Not used right now.
/*export function getPluralForm(
  forms: PluralForm,
  count: number,
  localeCode: string,
  vars?: Record<string, string | number>,
): string {
  const category = selectPluralCategory(localeCode, count);
  const template = forms[category] ?? forms.other;
  const all = { count, ...vars };
  return Object.entries(all).reduce(
    (s, [k, v]) => s.replaceAll(`{{${k}}}`, String(v)),
    template,
  );
}*/

export function GetDir(): Direction {
  const { direction } = useLocale();
  return direction;
}

export function useLang<K extends keyof LocaleTexts>(section: K): LocaleTexts[K] {
  const { localeTxt } = useLocale();
  return localeTxt[section];
}
