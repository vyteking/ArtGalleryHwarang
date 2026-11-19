import type { LocaleData, LocaleFile } from './locale.types'

// Every JSON file in ./localetextfiles is a locale; its file name (without ".json") is the locale ID.
// Adding a locale = adding a file; no import needed here.
const localeFiles = import.meta.glob<LocaleFile>('./localetextfiles/*.json', { eager: true, import: 'default' });

const DEFAULT_LOCALE_ID = 'en';

/** Builds a full BCP 47 tag (language-Script-REGION) from the LocaleInfo fields, for Intl and <html lang>. */
function buildTag(info: LocaleFile['LocaleInfo']): string {
    const script = info['code-variant']?.split('-').find((part) => /^[A-Za-z]{4}$/.test(part));
    const region = info['code-REGIONCODE']?.split('-').slice(1).find((part) => /^([A-Za-z]{2}|\d{3})$/.test(part));
    const tag = [info.code, script, region].filter(Boolean).join('-');
    try {
        return Intl.getCanonicalLocales(tag)[0];
    } catch {
        return info.code;
    }
}

const localeMap = new Map<string, LocaleData>(
    Object.entries(localeFiles).map(([path, file]) => {
        const id = path.slice(path.lastIndexOf('/') + 1, -'.json'.length);
        return [id, { ...file, id, tag: buildTag(file.LocaleInfo) }];
    })
);

// Tags that can't be matched from the LocaleInfo fields: legacy IDs used before the files were renamed.
// Keys are lower-case; matching is case-insensitive.
const localeAliases: Record<string, string> = {
    'zh-sc': 'zh-Hans',
    'zh-tc': 'zh-Hant',
};

// Chinese regions without their own locale: which script they read.
const chineseRegionScripts: Record<string, string> = {
    sg: 'hans', my: 'hans', hk: 'hant', mo: 'hant',
};

// Preferred locale when several locales share a language and nothing else decides (e.g. the browser reports "ko").
const languageDefaults: Record<string, string> = {
    ko: 'ko',
    pt: 'pt-BR',
    zh: 'zh-Hans',
};

const scriptOf = (data: LocaleData) => data.LocaleInfo['code-variant']?.split('-')[1]?.toLowerCase();
const regionOf = (data: LocaleData) => data.LocaleInfo['code-REGIONCODE']?.split('-')[1]?.toLowerCase();

function parseTag(tag: string): { language: string; script?: string; region?: string } {
    try {
        const locale = new Intl.Locale(tag.replace(/_/g, '-'));
        return { language: locale.language, script: locale.script?.toLowerCase(), region: locale.region?.toLowerCase() };
    } catch {
        const [language, ...rest] = tag.toLowerCase().split(/[-_]/);
        return {
            language,
            script: rest.find((part) => part.length === 4),
            region: rest.find((part) => part.length === 2 || /^\d{3}$/.test(part)),
        };
    }
}

/**
 * Maps any BCP 47 tag (from the browser, i18next or an older saved setting) to a locale ID.
 * Order: exact ID → legacy alias → same language + explicit script → same language + region
 * → language default → first locale of that language. Returns undefined when the language is not supported.
 */
export function ResolveLocaleCode(tag: string | undefined | null): string | undefined {
    if (!tag) return undefined;
    if (localeMap.has(tag)) return tag;

    const lower = tag.toLowerCase();
    for (const id of localeMap.keys()) {
        if (id.toLowerCase() === lower) return id;
    }
    if (localeAliases[lower]) return localeAliases[lower];

    const { language, script: explicitScript, region } = parseTag(tag);
    const sameLanguage = [...localeMap.values()].filter((data) => data.LocaleInfo.code.toLowerCase() === language);
    if (sameLanguage.length === 0) return undefined;

    const preferred = (candidates: LocaleData[]) =>
        candidates.find((data) => data.id === languageDefaults[language]) ?? candidates[0];

    const script = explicitScript ?? (language === 'zh' && region ? chineseRegionScripts[region] : undefined);
    if (script) {
        const byScript = sameLanguage.filter((data) => scriptOf(data) === script);
        if (byScript.length) {
            const byScriptAndRegion = byScript.filter((data) => regionOf(data) === region);
            return preferred(byScriptAndRegion.length ? byScriptAndRegion : byScript).id;
        }
    }
    if (region) {
        const byRegion = sameLanguage.filter((data) => regionOf(data) === region);
        if (byRegion.length) return preferred(byRegion).id;
    }
    return preferred(sameLanguage).id;
}

/** Locale ID → native language name, sorted by name. */
export function GetLocalesList(): Map<string, string> {
    return new Map(
        [...localeMap.entries()]
            .map(([id, data]) => [id, data.LocaleInfo.name] as [string, string])
            .sort((a, b) => a[1].localeCompare(b[1]))
    );
}

export function GetLocaleTexts(code: string): LocaleData {
    const resolved = ResolveLocaleCode(code);
    return (resolved && localeMap.get(resolved)) || localeMap.get(DEFAULT_LOCALE_ID)!;
}
