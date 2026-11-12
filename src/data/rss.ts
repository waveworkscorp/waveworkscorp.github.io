import { BLOG_STRINGS, CATEGORIES, getPosts, postName, postUrl } from './blog';
import { localePath } from './i18n';
import type { Lang } from './works';
import { rssXml } from '../lib/seo-core';

// 언어별 블로그 RSS. 새 글을 구독 도구와 AI 크롤러가 찾는 길
export async function rssResponse(site: URL | undefined, lang: Lang): Promise<Response> {
  const abs = (path: string): string => new URL(path, site).href;
  const s = BLOG_STRINGS[lang];
  const items = (await getPosts(lang)).map((e) => ({
    title: e.data.title,
    link: abs(postUrl(lang, postName(e))),
    description: e.data.excerpt,
    date: e.data.date,
    category: CATEGORIES[e.data.category].name[lang],
  }));
  const body = rssXml({ title: `WaveWorks ${s.title}`, link: abs(localePath(lang, '/blog/')), description: s.lead, lang, self: abs(localePath(lang, '/rss.xml')) }, items);
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
