import type { BlogEntry } from './blog';
import { postName, postUrl } from './blog';
import { COMPANY, DEVELOPER_STORES, localePath } from './i18n';
import { buildFaq } from '../lib/faq-core';
import { isAvailable, platformsOf, type Lang, type Work } from './works';
import { blogPostingLd, faqPageLd, organizationLd, softwareLd, websiteLd, type JsonLd } from '../lib/seo-core';

// 페이지에서 Astro.site를 받아 사이트 데이터로 구조화 데이터를 만든다. 형식은 lib/seo-core.ts
const origin = (site: URL | undefined): string => (site ?? new URL('https://waveworkscorp.github.io')).origin;
const abs = (site: URL | undefined, path: string): string => new URL(path, origin(site)).href;

export function homeLd(site: URL | undefined, lang: Lang): JsonLd[] {
  const o = origin(site);
  return [
    organizationLd({
      site: o,
      name: 'WaveWorks',
      alternateName: '웨이브웍스',
      logo: abs(site, '/img/logo1.png'),
      email: COMPANY.email,
      foundingDate: '2025-10',
      sameAs: [DEVELOPER_STORES.play, DEVELOPER_STORES.appStore].filter((u): u is string => Boolean(u)),
    }),
    websiteLd(o, 'WaveWorks', lang),
  ];
}

export function workLd(site: URL | undefined, lang: Lang, work: Work): JsonLd[] {
  const url = abs(site, localePath(lang, `/${work.slug}/`));
  const { entries, unknownLabels } = buildFaq(work, lang);
  // 새 앱이 질문표에 없는 info 라벨을 쓰면 빌드 때 알린다. 그 줄은 FAQ에서 빠지고 빌드는 계속된다
  if (lang === 'ko') unknownLabels.forEach((label) => console.warn(`[faq] ${work.slug}: 질문표(src/lib/faq-core.ts)에 없는 info 라벨 "${label}"`));
  const software = softwareLd({
    site: origin(site),
    url,
    name: work.name[lang],
    description: work.about[lang],
    image: abs(site, work.icon),
    category: work.category,
    lang,
    operatingSystems: isAvailable(work) ? platformsOf(work) : [],
    storeUrls: [work.stores.play, work.stores.appStore].filter((u): u is string => Boolean(u)),
  });
  return entries.length > 0 ? [software, faqPageLd(url, entries)] : [software];
}

export function postLd(site: URL | undefined, lang: Lang, entry: BlogEntry, image: string | undefined): JsonLd[] {
  return [blogPostingLd({
    site: origin(site),
    url: abs(site, postUrl(lang, postName(entry))),
    headline: entry.data.title,
    description: entry.data.excerpt,
    date: entry.data.date,
    lang,
    image: abs(site, image ?? '/img/logo1.png'),
    keywords: entry.data.tags,
  })];
}
