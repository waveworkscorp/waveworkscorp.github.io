// 법적 고지 주소와 언어 줄. import.meta 없이 순수 함수로 두어 node --test로 검사한다.
// ja·zh 문서는 본문만 그 언어이고 화면 틀은 영어다(R-044, 루트 docs/superpowers/specs/2026-11-12-site-legal-extra-langs-design.md)
export const LEGAL_LANGS = ['ko', 'en', 'ja', 'zh-hans', 'zh-hant'] as const;
export type LegalLang = (typeof LEGAL_LANGS)[number];

export const LANG_LABELS: Readonly<Record<LegalLang, string>> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  'zh-hans': '简体中文',
  'zh-hant': '中文(繁體)',
};

// <link hreflang>에 쓰는 BCP 47 표기
const HREFLANGS: Readonly<Record<LegalLang, string>> = { ko: 'ko', en: 'en', ja: 'ja', 'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant' };
const OG_LOCALES: Readonly<Record<LegalLang, string>> = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP', 'zh-hans': 'zh_CN', 'zh-hant': 'zh_TW' };

export interface LegalLangLink { href: string; label: string; hreflang: string; current: boolean }

const isLegalLang = (value: string): value is LegalLang => LEGAL_LANGS.some((lang) => lang === value);

// ../legal/ko/a/privacy.html -> a/privacy, ../legal/zh-hant/a/privacy.html -> zh-hant/a/privacy
export function toRoute(file: string): { route: string; docLang: LegalLang } {
  const [first = '', ...rest] = file.replace('../legal/', '').replace(/\.html$/, '').split('/');
  const docLang = isLegalLang(first) ? first : 'ko';
  return { route: [...(docLang === 'ko' ? [] : [docLang]), ...rest].join('/'), docLang };
}

// 법률 문서 주소에서 언어 접두어를 뗀 나머지(<id>/<doc>)
export function stripLangPrefix(route: string): string {
  const [first = '', ...rest] = route.split('/');
  return isLegalLang(first) ? rest.join('/') : route;
}

// ko·en 문서는 html[lang='en'] 글꼴 규칙이 맞도록 ko·en으로 고정하고, 추가 언어는 원문 값(zh-Hant 등)을 쓴다
export function htmlLangOf(html: string, docLang: LegalLang): string {
  if (docLang === 'ko' || docLang === 'en') return docLang;
  return /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1] ?? docLang;
}

export function ogLocale(lang: string): string {
  const key = LEGAL_LANGS.find((l) => l === lang.toLowerCase()) ?? 'en';
  return OG_LOCALES[key];
}

export function chromeLang(docLang: LegalLang): 'ko' | 'en' {
  return docLang === 'ko' ? 'ko' : 'en';
}

// 문서 탭: 읽던 언어판이 있으면 그 언어로 머물고, 없으면 화면 틀 언어판으로
export function docHref(doc: Partial<Record<LegalLang, string>>, docLang: LegalLang): string | undefined {
  return doc[docLang] ?? doc[chromeLang(docLang)];
}

export function langLinks(doc: Partial<Record<LegalLang, string>>, current: string): LegalLangLink[] {
  // 영어 한 장뿐인 문서는 ko 주소도 영문을 가리키니 같은 주소는 처음 언어 하나만 남긴다
  return LEGAL_LANGS.flatMap((lang, index) => {
    const href = doc[lang];
    const seen = LEGAL_LANGS.slice(0, index).some((before) => doc[before] === href);
    return href && !seen ? [{ href, label: LANG_LABELS[lang], hreflang: HREFLANGS[lang], current: href === current }] : [];
  });
}
