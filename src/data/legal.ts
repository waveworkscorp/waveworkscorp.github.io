import { WORKS, type Lang } from './works';
import { STRINGS, localePath } from './i18n';
import { chromeLang, docHref, htmlLangOf, langLinks, stripLangPrefix, toRoute, type LegalLang, type LegalLangLink } from '../lib/legal-core';

// 스토어에 등록한 법적 고지 원문(src/legal/**.html)을 그대로 읽어 사이트 테마로 감싼다.
// 원문은 <언어>/ 아래에 두고, 주소는 /<게임>/<문서>/, /en/<게임>/<문서>/, /ja/<게임>/<문서>/ 등이 된다
const SOURCES = import.meta.glob<string>('../legal/**/*.html', { query: '?raw', import: 'default', eager: true });

export interface LegalLink { href: string; label: string; current: boolean }

export interface LegalPage {
  route: string; // 앞뒤 '/' 없는 주소. 예: babylog/privacy, en/babylog/privacy, ja/babylog/privacy, privacy
  lang: Lang; // 화면 틀 언어. ko 문서만 ko, 나머지는 en
  docLang: LegalLang;
  htmlLang: string; // 원문 <html lang> 그대로(예: zh-Hant)
  title: string;
  description: string;
  heading: string; // 원문 h1 (줄바꿈 <br> 포함)
  links: LegalLink[];
  langs: LegalLangLink[]; // 같은 문서의 언어 줄. 언어가 하나면 비운다
  back: string | null; // 이 문서가 딸린 게임 상세 주소. 여러 게임이 같이 쓰는 문서(/privacy/, /terms/)는 null
  body: string;
}

function pick(html: string, re: RegExp): string {
  return re.exec(html)?.[1]?.trim() ?? '';
}

const DOC_KEYS = ['privacy', 'terms', 'deletion', 'health-data'] as const;

function toUrl(route: string): string {
  return `/${route}/`;
}

// 문서 탭은 원문 nav 대신 works.ts의 문서 목록으로 만든다. 같은 게임의 문서를 화면 틀 언어로 두고, 지금 문서의 언어들은 따로 줄을 둔다
function buildLinks(url: string, docLang: LegalLang): { links: LegalLink[]; langs: LegalLangLink[] } {
  for (const w of WORKS) {
    const key = DOC_KEYS.find((k) => Object.values(w[k] ?? {}).includes(url));
    if (!key) continue;
    const lang = chromeLang(docLang);
    const links = DOC_KEYS.flatMap((k) => {
      const href = docHref(w[k] ?? {}, docLang);
      return href ? [{ href, label: STRINGS[lang][k], current: k === key }] : [];
    });
    const langs = langLinks(w[key] ?? {}, url);
    return { links, langs: langs.length > 1 ? langs : [] };
  }
  return { links: [], langs: [] };
}

function backPath(route: string, lang: Lang): string | null {
  const work = WORKS.find((w) => stripLangPrefix(route).startsWith(`${w.slug}/`));
  return work ? localePath(lang, `/${work.slug}/`) : null;
}

function parse(file: string, html: string): LegalPage {
  const { route, docLang } = toRoute(file);
  const lang: Lang = chromeLang(docLang);
  const main = pick(html, /<main>([\s\S]*?)<\/main>/);
  const heading = pick(main, /<h1>([\s\S]*?)<\/h1>/);
  const title = pick(html, /<title>([\s\S]*?)<\/title>/);
  return {
    route,
    lang,
    docLang,
    htmlLang: htmlLangOf(html, docLang),
    title,
    description: pick(html, /<meta name="description" content="([^"]*)"/) || title,
    heading,
    ...buildLinks(toUrl(route), docLang),
    back: backPath(route, lang),
    body: main.replace(/<h1>[\s\S]*?<\/h1>/, '').trim(),
  };
}

export const LEGAL_PAGES: readonly LegalPage[] = Object.entries(SOURCES).map(([file, html]) => parse(file, html));
