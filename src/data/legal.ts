import { WORKS, type Lang } from './works';
import { STRINGS, localePath } from './i18n';

// 스토어에 등록한 법적 고지 원문(src/legal/**.html)을 그대로 읽어 사이트 테마로 감싼다.
// 원문은 ko/·en/ 아래에 두고, 주소는 /<게임>/<문서>/와 /en/<게임>/<문서>/가 된다
const SOURCES = import.meta.glob<string>('../legal/**/*.html', { query: '?raw', import: 'default', eager: true });

export interface LegalLink { href: string; label: string; current: boolean }

export interface LegalPage {
  route: string; // 앞뒤 '/' 없는 주소. 예: babylog/privacy, en/babylog/privacy, privacy
  lang: Lang;
  title: string;
  description: string;
  heading: string; // 원문 h1 (줄바꿈 <br> 포함)
  links: LegalLink[];
  back: string | null; // 이 문서가 딸린 게임 상세 주소. 여러 게임이 같이 쓰는 문서(/privacy/, /terms/)는 null
  body: string;
}

function pick(html: string, re: RegExp): string {
  return re.exec(html)?.[1]?.trim() ?? '';
}

// ../legal/ko/unscrew/privacy.html -> unscrew/privacy, ../legal/en/unscrew/privacy.html -> en/unscrew/privacy
function toRoute(file: string): string {
  const [lang, ...rest] = file.replace('../legal/', '').replace(/\.html$/, '').split('/');
  return [...(lang === 'en' ? ['en'] : []), ...rest].join('/');
}

const DOC_KEYS = ['privacy', 'terms', 'deletion', 'health-data'] as const;
const OTHER: Record<Lang, Lang> = { ko: 'en', en: 'ko' };

function toUrl(route: string): string {
  return `/${route}/`;
}

// 문서 탭은 원문 nav 대신 works.ts의 문서 목록으로 만든다. 같은 게임의 문서와 반대 언어 문서를 둔다
function buildLinks(url: string, lang: Lang): LegalLink[] {
  for (const w of WORKS) {
    const key = DOC_KEYS.find((k) => w[k]?.[lang] === url);
    if (!key) continue;
    const docs = DOC_KEYS.flatMap((k) => {
      const href = w[k]?.[lang];
      return href ? [{ href, label: STRINGS[lang][k], current: href === url }] : [];
    });
    const other = w[key]?.[OTHER[lang]];
    return other && other !== url ? [...docs, { href: other, label: lang === 'ko' ? 'English' : '한국어', current: false }] : docs;
  }
  return [];
}

function backPath(route: string, lang: Lang): string | null {
  const work = WORKS.find((w) => route.replace(/^en\//, '').startsWith(`${w.slug}/`));
  return work ? localePath(lang, `/${work.slug}/`) : null;
}

function parse(file: string, html: string): LegalPage {
  const route = toRoute(file);
  const lang: Lang = pick(html, /<html lang="([a-z]+)"/) === 'en' ? 'en' : 'ko';
  const main = pick(html, /<main>([\s\S]*?)<\/main>/);
  const heading = pick(main, /<h1>([\s\S]*?)<\/h1>/);
  const title = pick(html, /<title>([\s\S]*?)<\/title>/);
  return {
    route,
    lang,
    title,
    description: pick(html, /<meta name="description" content="([^"]*)"/) || title,
    heading,
    links: buildLinks(toUrl(route), lang),
    back: backPath(route, lang),
    body: main.replace(/<h1>[\s\S]*?<\/h1>/, '').trim(),
  };
}

export const LEGAL_PAGES: readonly LegalPage[] = Object.entries(SOURCES).map(([file, html]) => parse(file, html));
