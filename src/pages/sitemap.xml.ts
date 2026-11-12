import type { APIRoute } from 'astro';
import { getPosts, postName, type BlogEntry } from '../data/blog';
import { localePath } from '../data/i18n';
import { WORKS, type Lang } from '../data/works';
import { langPairEntries, sitemapXml, type SitemapEntry } from '../lib/seo-core';

// 검색엔진에 알릴 주소 목록. 약관·옛 주소 리다이렉트는 넣지 않는다
const PAGES = ['/', '/works/', '/blog/', '/about/', '/contact/', ...WORKS.map((w) => `/${w.slug}/`)];

export const GET: APIRoute = async ({ site }) => {
  const url = (lang: Lang, path: string): string => new URL(localePath(lang, path), site).href;
  const pages: SitemapEntry[] = PAGES.flatMap((p) => langPairEntries((['ko', 'en'] as const).map((lang) => ({ lang, href: url(lang, p) }))));
  // 글은 언어판마다 자기 수정일(없으면 게시일)을 lastmod로 쓴다. 영어판이 없는 글은 한국어판만 적는다
  const en = new Map((await getPosts('en')).map((e) => [postName(e), e]));
  const posts = (await getPosts('ko')).flatMap((ko) => {
    const name = postName(ko);
    const enEntry = en.get(name);
    const versions: [Lang, BlogEntry][] = enEntry ? [['ko', ko], ['en', enEntry]] : [['ko', ko]];
    return langPairEntries(versions.map(([lang, e]) => ({ lang, href: url(lang, `/blog/${name}/`), lastmod: e.data.updated ?? e.data.date })));
  });
  const body = sitemapXml([...pages, ...posts]);
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
