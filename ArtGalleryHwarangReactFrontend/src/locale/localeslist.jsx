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

export function GetLocalesList() {
    const ls = new Map();
    ls.set(locale_de.LocaleInfo.code, locale_de.LocaleInfo.name);
    ls.set(locale_en.LocaleInfo.code, locale_en.LocaleInfo.name);
    ls.set(locale_es.LocaleInfo.code, locale_es.LocaleInfo.name);
    ls.set(locale_fr.LocaleInfo.code, locale_fr.LocaleInfo.name);
    ls.set(locale_ja.LocaleInfo.code, locale_ja.LocaleInfo.name);
    ls.set(locale_ko_HJ.LocaleInfo.code, locale_ko_HJ.LocaleInfo.name);
    ls.set(locale_ko.LocaleInfo.code, locale_ko.LocaleInfo.name);
    ls.set(locale_ru.LocaleInfo.code, locale_ru.LocaleInfo.name);
    ls.set(locale_zh_SC.LocaleInfo.code, locale_zh_SC.LocaleInfo.name);
    ls.set(locale_zh_TC.LocaleInfo.code, locale_zh_TC.LocaleInfo.name);
    const sortedLS = new Map([...ls.entries()].sort((a, b) => a[1] - b[1]));
    return sortedLS;
}

export async function GetLocaleTexts(currentLocale) {
    switch (currentLocale) {
        case 'de':
            return locale_de;
        case 'en':
            return locale_en;
        case 'es':
            return locale_es;
        case 'fr':
            return locale_fr;
        case 'ja':
            return locale_ja;
        case 'ko-HJ':
            return locale_ko_HJ;
        case 'ko':
            return locale_ko;
        case 'ru':
            return locale_ru;
        case 'zh-SC':
            return locale_zh_SC;
        case 'zh-TC':
            return locale_zh_TC;
        default:
            return locale_en;
    }
}