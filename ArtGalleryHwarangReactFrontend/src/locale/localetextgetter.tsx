import { useCallback } from 'react';
import { useLocale } from './localeoptions';
import i18n from '../i18n';
import type { LocaleFormat, LocaleTexts, PluralForm } from './locale.types';
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

const numberFormatCache = new Map<string, Intl.NumberFormat>();

function getNumberFormat(localeCode: string): Intl.NumberFormat {
  let nf = numberFormatCache.get(localeCode);
  if (!nf) {
    const candidates = [localeCode, localeCode.split('-')[0], 'en'];
    for (const tag of candidates) {
      try {
        nf = new Intl.NumberFormat(tag, { maximumFractionDigits: 20 });
        break;
      } catch {
        continue;
      }
    }
    nf ??= new Intl.NumberFormat();
    numberFormatCache.set(localeCode, nf);
  }
  return nf;
}

// A plain space in the locale file means "space separator"; render it non-breaking so numbers never wrap.
const toSeparator = (sep: string) => (sep === ' ' ? ' ' : sep);

/**
 * Formats a number for display. Grouping rules (where groups go, minimum grouping digits) come from
 * Intl/CLDR for the locale; the separator characters come from the locale file's `format` block when given.
 */
export function formatNumber(
  value: number,
  localeCode: string,
  format?: Pick<LocaleFormat, 'number_decimal_separator' | 'number_group_separator'>,
): string {
  const nf = getNumberFormat(localeCode);
  if (!format) return nf.format(value);
  return nf
    .formatToParts(value)
    .map((part) => {
      if (part.type === 'group') return toSeparator(format.number_group_separator);
      if (part.type === 'decimal') return toSeparator(format.number_decimal_separator);
      return part.value;
    })
    .join('');
}

export function getPluralForm(
  forms: PluralForm,
  count: number,
  localeCode: string,
  format?: Pick<LocaleFormat, 'number_decimal_separator' | 'number_group_separator'>,
): string {
  const category = selectPluralCategory(localeCode, count);
  const template = forms[category] ?? forms.other;
  return template.replaceAll('{{count}}', formatNumber(count, localeCode, format));
}

export function usePluralForm() {
  const { currentLocale } = useLocale();
  const code = currentLocale.tag;
  const format = currentLocale.format;
  return useCallback(
    (forms: PluralForm, count: number) => getPluralForm(forms, count, code, format),
    [code, format]
  );
}

export function useNumberFormat() {
  const { currentLocale } = useLocale();
  const code = currentLocale.tag;
  const format = currentLocale.format;
  return useCallback((value: number) => formatNumber(value, code, format), [code, format]);
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
