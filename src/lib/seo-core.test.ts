import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blogPostingLd, faqPageLd, langPairEntries, organizationLd, rssXml, sitemapXml, softwareLd, xmlEscape } from './seo-core.ts';

const SITE = 'https://example.com';

test('xmlEscape: XML 특수문자를 바꾼다', () => {
  assert.equal(xmlEscape(`a & b < c > "d" 'e'`), 'a &amp; b &lt; c &gt; &quot;d&quot; &apos;e&apos;');
});

test('sitemapXml: 주소와 언어 쌍을 적는다', () => {
  const xml = sitemapXml([
    { loc: `${SITE}/`, alternates: [{ lang: 'ko', href: `${SITE}/` }, { lang: 'en', href: `${SITE}/en/` }], lastmod: '2026-11-01' },
    { loc: `${SITE}/a?b&c/` },
  ]);
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
  assert.match(xml, /<url><loc>https:\/\/example.com\/<\/loc><lastmod>2026-11-01<\/lastmod><xhtml:link rel="alternate" hreflang="ko" href="https:\/\/example.com\/"\/><xhtml:link rel="alternate" hreflang="en" href="https:\/\/example.com\/en\/"\/><xhtml:link rel="alternate" hreflang="x-default" href="https:\/\/example.com\/"\/><\/url>/);
  assert.match(xml, /<loc>https:\/\/example.com\/a\?b&amp;c\/<\/loc>/);
});

test('sitemapXml: 언어 쌍이 하나뿐이면 hreflang을 달지 않는다', () => {
  const xml = sitemapXml([{ loc: `${SITE}/x/`, alternates: [{ lang: 'ko', href: `${SITE}/x/` }] }]);
  assert.doesNotMatch(xml, /hreflang/);
});

test('langPairEntries: 언어판마다 자기 lastmod를 쓰고 언어 쌍은 함께 단다', () => {
  const entries = langPairEntries([
    { lang: 'ko', href: `${SITE}/p/`, lastmod: '2026-10-31' },
    { lang: 'en', href: `${SITE}/en/p/`, lastmod: '2026-11-12' },
  ]);
  assert.deepEqual(entries.map((e) => [e.loc, e.lastmod]), [[`${SITE}/p/`, '2026-10-31'], [`${SITE}/en/p/`, '2026-11-12']]);
  assert.deepEqual(entries[1].alternates, [{ lang: 'ko', href: `${SITE}/p/` }, { lang: 'en', href: `${SITE}/en/p/` }]);
});

test('rssXml: 채널과 글을 날짜 내림차순 RFC 822 형식으로 적는다', () => {
  const xml = rssXml(
    { title: 'Blog & News', link: `${SITE}/blog/`, description: 'd', lang: 'ko', self: `${SITE}/rss.xml` },
    [
      { title: 'old', link: `${SITE}/blog/old/`, description: 'o', date: '2026-10-01', category: 'news' },
      { title: 'new <1>', link: `${SITE}/blog/new/`, description: 'n', date: '2026-11-01', category: 'making' },
    ],
  );
  assert.match(xml, /<title>Blog &amp; News<\/title>/);
  assert.match(xml, /<language>ko<\/language>/);
  assert.match(xml, /<atom:link href="https:\/\/example.com\/rss.xml" rel="self" type="application\/rss\+xml"\/>/);
  assert.ok(xml.indexOf('new &lt;1&gt;') < xml.indexOf('<title>old</title>'));
  assert.match(xml, /<pubDate>Sun, 01 Nov 2026 00:00:00 GMT<\/pubDate>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/example.com\/blog\/new\/<\/guid>/);
});

test('organizationLd: 회사 정보와 sameAs를 담는다', () => {
  const ld = organizationLd({ site: SITE, name: 'W', alternateName: '웨', logo: `${SITE}/l.png`, email: 'a@b.c', foundingDate: '2025-10', sameAs: ['https://play.google.com/x'] });
  assert.equal(ld['@type'], 'Organization');
  assert.equal(ld['@id'], `${SITE}/#organization`);
  assert.deepEqual(ld.sameAs, ['https://play.google.com/x']);
});

test('organizationLd: sameAs가 비면 넣지 않는다', () => {
  const ld = organizationLd({ site: SITE, name: 'W', logo: `${SITE}/l.png`, sameAs: [] });
  assert.equal('sameAs' in ld, false);
  assert.equal('alternateName' in ld, false);
});

test('softwareLd: 게임은 GameApplication, 스토어 주소는 installUrl과 sameAs로', () => {
  const ld = softwareLd({ site: SITE, url: `${SITE}/g/`, name: 'G', description: 'd', image: `${SITE}/i.png`, category: 'game', lang: 'ko', operatingSystems: ['Android'], storeUrls: ['https://play.google.com/g'] });
  assert.equal(ld['@type'], 'SoftwareApplication');
  assert.equal(ld.applicationCategory, 'GameApplication');
  assert.equal(ld.operatingSystem, 'Android');
  assert.equal(ld.installUrl, 'https://play.google.com/g');
  // 다른 페이지의 @id를 Google이 잇지 않으므로 이름도 함께 둔다
  assert.deepEqual(ld.publisher, { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'WaveWorks' });
});

test('softwareLd: 출시 전 작품은 운영체제·설치 주소를 빼고 앱은 MobileApplication 범주', () => {
  const ld = softwareLd({ site: SITE, url: `${SITE}/a/`, name: 'A', description: 'd', image: `${SITE}/i.png`, category: 'app', lang: 'en', operatingSystems: [], storeUrls: [] });
  assert.equal(ld.applicationCategory, 'LifestyleApplication');
  assert.equal('operatingSystem' in ld, false);
  assert.equal('installUrl' in ld, false);
});

test('blogPostingLd: 제목·날짜·언어·대표 이미지를 담는다', () => {
  const ld = blogPostingLd({ site: SITE, url: `${SITE}/blog/p/`, headline: 'H', description: 'd', date: '2026-11-01', dateModified: '2026-11-12', lang: 'ko', image: `${SITE}/c.jpg`, keywords: ['a', 'b'], author: { name: '홍마초', url: `${SITE}/about/` } });
  assert.equal(ld['@type'], 'BlogPosting');
  assert.equal(ld.datePublished, '2026-11-01');
  assert.equal(ld.inLanguage, 'ko');
  assert.equal(ld.image, `${SITE}/c.jpg`);
  assert.equal(ld.keywords, 'a, b');
  assert.deepEqual(ld.mainEntityOfPage, { '@type': 'WebPage', '@id': `${SITE}/blog/p/` });
  assert.equal(ld.dateModified, '2026-11-12');
  assert.deepEqual(ld.author, { '@type': 'Person', name: '홍마초', url: `${SITE}/about/` });
  assert.equal((ld.publisher as Record<string, unknown>)['@type'], 'Organization');
});

test('faqPageLd: 문답을 Question과 acceptedAnswer로 담는다', () => {
  const ld = faqPageLd(`${SITE}/a/`, [{ q: 'Q', a: 'A' }]);
  assert.equal(ld['@type'], 'FAQPage');
  assert.equal(ld.url, `${SITE}/a/`);
  assert.deepEqual((ld.mainEntity as unknown[])[0], { '@type': 'Question', name: 'Q', acceptedAnswer: { '@type': 'Answer', text: 'A' } });
});
