import type { APIRoute } from 'astro';
import { getPosts, hasTranslation, postName } from '../data/blog';
import { localePath } from '../data/i18n';
import { WORKS, type Lang } from '../data/works';
import { sitemapXml, type SitemapEntry } from '../lib/seo-core';

// 검색엔진에 알릴 주소 목록. 약관·옛 주소 리다이렉트는 넣지 않는다
const PAGES = ['/', '/works/', '/blog/', '/about/', '/contact/', ...WORKS.map((w) => `/${w.slug}/`)];

export const GET: APIRoute = async ({ site }) => {
  const url = (lang: Lang, path: string): string => new URL(localePath(lang, path), site).href;
  const pair = (path: string, langs: readonly Lang[], lastmod?: string): SitemapEntry[] => {
    const alternates = langs.map((lang) => ({ lang, href: url(lang, path) }));
    return langs.map((lang) => ({ loc: url(lang, path), alternates, lastmod }));
  };
  const posts = await Promise.all((await getPosts('ko')).map(async (e) => {
    const name = postName(e);
    const langs: Lang[] = (await hasTranslation(name, 'en')) ? ['ko', 'en'] : ['ko'];
    return pair(`/blog/${name}/`, langs, e.data.updated ?? e.data.date);
  }));
  const body = sitemapXml([...PAGES.flatMap((p) => pair(p, ['ko', 'en'])), ...posts.flat()]);
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
