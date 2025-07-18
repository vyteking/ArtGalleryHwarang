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