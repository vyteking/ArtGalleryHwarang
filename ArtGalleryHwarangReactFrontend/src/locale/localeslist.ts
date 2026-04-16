import locale_de from './localetextfiles/de.json'
import locale_en from './localetextfiles/en.json'
import locale_es from './localetextfiles/es.json'
import locale_fr from './localetextfiles/fr.json'
import locale_ja from './localetextfiles/ja.json'
import locale_ko_HJ from './localetextfiles/ko-HJ.json'
import locale_ko from './localetextfiles/ko.json'
import locale_ru from './localetextfiles/ru.json'
import locale_zh_SC from './localetextfiles/zh-SC.json'
import locale_zh_TC from './localetextfiles/zh-TC.json'
import type { LocaleData } from './locale.types'

const localeMap = new Map<string, LocaleData>([
    [locale_de.LocaleInfo.code,    locale_de    as unknown as LocaleData],
    [locale_en.LocaleInfo.code,    locale_en    as unknown as LocaleData],
    [locale_es.LocaleInfo.code,    locale_es    as unknown as LocaleData],
    [locale_fr.LocaleInfo.code,    locale_fr    as unknown as LocaleData],
    [locale_ja.LocaleInfo.code,    locale_ja    as unknown as LocaleData],
    [locale_ko_HJ.LocaleInfo.code, locale_ko_HJ as unknown as LocaleData],
    [locale_ko.LocaleInfo.code,    locale_ko    as unknown as LocaleData],
    [locale_ru.LocaleInfo.code,    locale_ru    as unknown as LocaleData],
    [locale_zh_SC.LocaleInfo.code, locale_zh_SC as unknown as LocaleData],
    [locale_zh_TC.LocaleInfo.code, locale_zh_TC as unknown as LocaleData],
]);

export function GetLocalesList(): Map<string, string> {
    return new Map(
        [...localeMap.entries()]
            .map(([code, data]) => [code, data.LocaleInfo.name] as [string, string])
            .sort((a, b) => a[1].localeCompare(b[1]))
    );
}

export function GetLocaleTexts(code: string): LocaleData {
    return localeMap.get(code) ?? (locale_en as unknown as LocaleData);
}
