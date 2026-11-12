// sitemap·RSS·구조화 데이터(JSON-LD) 문자열을 만드는 순수 함수. astro 없이 node --test로 검사한다

export type SeoLang = 'ko' | 'en';
export type JsonLd = Record<string, unknown>;

export const xmlEscape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export interface SitemapEntry {
  loc: string;
  // 같은 글의 언어판 주소. 둘 이상일 때만 hreflang으로 적고, 첫 항목을 x-default로 삼는다
  alternates?: readonly { lang: SeoLang; href: string }[];
  lastmod?: string;
}

export function sitemapXml(entries: readonly SitemapEntry[]): string {
  const urls = entries.map(({ loc, alternates = [], lastmod }) => {
    const links = alternates.length > 1
      ? [...alternates, { lang: 'x-default', href: alternates[0].href }]
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${xmlEscape(a.href)}"/>`).join('')
      : '';
    return `<url><loc>${xmlEscape(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${links}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

export interface RssChannel { title: string; link: string; description: string; lang: SeoLang; self: string }
export interface RssItem { title: string; link: string; description: string; date: string; category: string }

// RSS는 RFC 822 날짜를 쓴다. 글 날짜는 YYYY-MM-DD라 UTC 자정으로 본다
const rfc822 = (date: string): string => new Date(`${date}T00:00:00Z`).toUTCString();

export function rssXml(channel: RssChannel, items: readonly RssItem[]): string {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const body = sorted.map((i) => [
    '<item>',
    `<title>${xmlEscape(i.title)}</title>`,
    `<link>${xmlEscape(i.link)}</link>`,
    `<guid isPermaLink="true">${xmlEscape(i.link)}</guid>`,
    `<description>${xmlEscape(i.description)}</description>`,
    `<category>${xmlEscape(i.category)}</category>`,
    `<pubDate>${rfc822(i.date)}</pubDate>`,
    '</item>',
  ].join('')).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>`
    + `<title>${xmlEscape(channel.title)}</title><link>${xmlEscape(channel.link)}</link>`
    + `<description>${xmlEscape(channel.description)}</description><language>${channel.lang}</language>`
    + `<atom:link href="${xmlEscape(channel.self)}" rel="self" type="application/rss+xml"/>`
    + (sorted[0] ? `<lastBuildDate>${rfc822(sorted[0].date)}</lastBuildDate>` : '')
    + `\n${body}\n</channel></rss>\n`;
}

// Google은 다른 페이지에 정의한 @id를 이어 읽지 않으므로 이름도 함께 둔다
const orgRef = (site: string): JsonLd => ({ '@type': 'Organization', '@id': `${site}/#organization`, name: 'WaveWorks' });

export interface OrganizationInput {
  site: string;
  name: string;
  alternateName?: string;
  logo: string;
  email?: string;
  foundingDate?: string;
  sameAs: readonly string[];
}

export function organizationLd(o: OrganizationInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${o.site}/#organization`,
    name: o.name,
    ...(o.alternateName ? { alternateName: o.alternateName } : {}),
    url: `${o.site}/`,
    logo: o.logo,
    ...(o.email ? { email: o.email } : {}),
    ...(o.foundingDate ? { foundingDate: o.foundingDate } : {}),
    ...(o.sameAs.length > 0 ? { sameAs: [...o.sameAs] } : {}),
  };
}

export function websiteLd(site: string, name: string, lang: SeoLang): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site}/#website`,
    url: `${site}/`,
    name,
    inLanguage: lang,
    publisher: orgRef(site),
  };
}

export interface SoftwareInput {
  site: string;
  url: string;
  name: string;
  description: string;
  image: string;
  category: 'game' | 'app' | 'web';
  lang: SeoLang;
  operatingSystems: readonly string[];
  storeUrls: readonly string[];
}

const APP_CATEGORY = { game: 'GameApplication', app: 'LifestyleApplication', web: 'WebApplication' } as const;

// 가격·평점은 사이트에 확인된 값이 없어 넣지 않는다(사이트 규칙: 확인 안 된 사실을 적지 않음)
export function softwareLd(s: SoftwareInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: s.name,
    description: s.description,
    url: s.url,
    image: s.image,
    applicationCategory: APP_CATEGORY[s.category],
    inLanguage: s.lang,
    ...(s.operatingSystems.length > 0 ? { operatingSystem: s.operatingSystems.join(', ') } : {}),
    ...(s.storeUrls.length > 0 ? { installUrl: s.storeUrls[0], sameAs: [...s.storeUrls] } : {}),
    publisher: orgRef(s.site),
  };
}

export interface BlogPostingInput {
  site: string;
  url: string;
  headline: string;
  description: string;
  date: string;
  // 고친 날짜. 고친 적 없으면 date와 같다
  dateModified: string;
  lang: SeoLang;
  image: string;
  keywords: readonly string[];
  author: { name: string; url: string };
}

export function blogPostingLd(p: BlogPostingInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.headline,
    description: p.description,
    datePublished: p.date,
    dateModified: p.dateModified,
    inLanguage: p.lang,
    image: p.image,
    keywords: p.keywords.join(', '),
    url: p.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': p.url },
    author: { '@type': 'Person', name: p.author.name, url: p.author.url },
    publisher: orgRef(p.site),
  };
}

// Google은 FAQ 리치 결과를 정부·보건 사이트에만 보여 준다. 여기서는 AI 답변·음성 비서가 문답을 인용하도록 둔다
export function faqPageLd(url: string, entries: readonly { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity: entries.map((e) => ({ '@type': 'Question', name: e.q, acceptedAnswer: { '@type': 'Answer', text: e.a } })),
  };
}
