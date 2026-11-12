import type { APIRoute } from 'astro';
import { getPosts, postName, postUrl } from '../data/blog';
import { STRINGS, localePath } from '../data/i18n';
import { WORKS, platformsOf, type Lang, type Work } from '../data/works';
import { llmsTxt, type LlmsLink } from '../lib/llms-core';

// AI 검색용 사이트 안내. 사이트맵과 같은 공개 주소만 적고 약관·옛 주소는 넣지 않는다
const PAGES = [
  { path: '/', title: 'Home' },
  { path: '/works/', title: 'Games and apps' },
  { path: '/about/', title: 'About WaveWorks' },
  { path: '/blog/', title: 'Blog' },
  { path: '/contact/', title: 'Contact' },
];

const workNote = (w: Work): string => {
  const platforms = platformsOf(w);
  return `${w.tagline.en} (Korean name: ${w.name.ko})${platforms.length > 0 ? `. Available on ${platforms.join(' and ')}` : ''}`;
};

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string): string => new URL(path, site).href;
  const url = (lang: Lang, path: string): string => abs(localePath(lang, path));
  const pages: LlmsLink[] = PAGES.flatMap((p) => [
    { title: p.title, url: url('en', p.path), note: 'English' },
    { title: p.title, url: url('ko', p.path), note: 'Korean' },
  ]);
  const works: LlmsLink[] = WORKS.map((w) => ({ title: w.name.en, url: url('en', `/${w.slug}/`), note: workNote(w) }));
  const posts = async (lang: Lang): Promise<LlmsLink[]> =>
    (await getPosts(lang)).map((e) => ({ title: e.data.title, url: abs(postUrl(lang, postName(e))), note: e.data.excerpt }));
  const body = llmsTxt({
    title: 'WaveWorks',
    summary: `${STRINGS.en.homeDesc} Every page has a Korean version (default) and an English version under /en/.`,
    sections: [
      { heading: 'Pages', links: pages },
      { heading: 'Games and apps', links: works },
      { heading: 'Blog (English)', links: await posts('en') },
      { heading: 'Blog (Korean)', links: await posts('ko') },
      { heading: 'Optional', links: [{ title: 'Sitemap', url: abs('/sitemap.xml') }, { title: 'RSS (Korean)', url: abs('/rss.xml') }, { title: 'RSS (English)', url: abs('/en/rss.xml') }] },
    ],
  });
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
