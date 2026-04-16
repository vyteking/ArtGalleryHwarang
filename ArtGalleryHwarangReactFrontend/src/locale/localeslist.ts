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

const localeMap = new Map([
    [locale_de.LocaleInfo.code, locale_de],
    [locale_en.LocaleInfo.code, locale_en],
    [locale_es.LocaleInfo.code, locale_es],
    [locale_fr.LocaleInfo.code, locale_fr],
    [locale_ja.LocaleInfo.code, locale_ja],
    [locale_ko_HJ.LocaleInfo.code, locale_ko_HJ],
    [locale_ko.LocaleInfo.code, locale_ko],
    [locale_ru.LocaleInfo.code, locale_ru],
    [locale_zh_SC.LocaleInfo.code, locale_zh_SC],
    [locale_zh_TC.LocaleInfo.code, locale_zh_TC],
]);

export function GetLocalesList() {
    return new Map([...localeMap.entries()].map(([code, data]) => [code, data.LocaleInfo.name]).sort((a, b) => a[1].localeCompare(b[1])));
}

export function GetLocaleTexts(code) {
    return localeMap.get(code) || locale_en;
}