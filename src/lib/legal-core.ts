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

export interface LegalLangLink { href: string; label: string; current: boolean }

const isLegalLang = (value: string): value is LegalLang => LEGAL_LANGS.some((lang) => lang === value);

// ../legal/ko/a/privacy.html -> a/privacy, ../legal/zh-hant/a/privacy.html -> zh-hant/a/privacy
export function toRoute(file: string): { route: string; docLang: LegalLang } {
  const [first = '', ...rest] = file.replace('../legal/', '').replace(/\.html$/, '').split('/');
  const docLang = isLegalLang(first) ? first : 'ko';
  return { route: [...(docLang === 'ko' ? [] : [docLang]), ...rest].join('/'), docLang };
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
    return href && !seen ? [{ href, label: LANG_LABELS[lang], current: href === current }] : [];
  });
}
