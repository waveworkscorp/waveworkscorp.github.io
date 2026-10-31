import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang, Work } from './works';
import { WORKS } from './works';
import { localePath } from './i18n';
import { findOrphans, readMinutes, sortPosts, type PostMeta } from '../lib/blog-core.ts';
import type { BLOG_CATEGORY_KEYS } from '../content.config';

export type BlogCategory = (typeof BLOG_CATEGORY_KEYS)[number];
export type BlogEntry = CollectionEntry<'blog'>;
type Text = Record<Lang, string>;

export const CATEGORIES: Record<BlogCategory, { name: Text; desc: Text; color: string }> = {
  making: { name: { ko: '제작기', en: 'Making' }, desc: { ko: '게임과 앱을 만든 과정', en: 'How we build our games and apps' }, color: 'var(--wave)' },
  news: { name: { ko: '소식', en: 'News' }, desc: { ko: '출시와 업데이트 소식', en: 'Launches and updates' }, color: 'var(--tang)' },
  culture: { name: { ko: '문화', en: 'Culture' }, desc: { ko: '우리가 일하는 방식', en: 'How we work' }, color: 'var(--coral)' },
};

export const BLOG_STRINGS = {
  ko: {
    title: '블로그',
    lead: '웨이브웍스가 게임과 앱을 만들며 겪은 일, 출시 소식, 일하는 방식을 적습니다.',
    all: '전체',
    search: '글 검색',
    searchPlaceholder: '제목, 태그로 찾기',
    noResults: '찾는 글이 없습니다. 다른 낱말로 찾아 보세요.',
    empty: '첫 글을 준비하고 있습니다.',
    clearFilter: '필터 지우기',
    toc: '목차',
    tags: '태그',
    relatedPosts: '함께 읽을 글',
    relatedWorks: '이 글에 나온 작품',
    copyLink: '링크 복사',
    copied: '복사했습니다',
    shareX: 'X에 공유',
    backToList: '블로그 목록으로',
    minRead: '{n}분',
    workPosts: '이 작품 이야기',
  },
  en: {
    title: 'Blog',
    lead: 'Notes from WaveWorks on making games and apps, launches, and how we work.',
    all: 'All',
    search: 'Search posts',
    searchPlaceholder: 'Search by title or tag',
    noResults: 'No posts match. Try another word.',
    empty: 'Our first post is on its way.',
    clearFilter: 'Clear filter',
    toc: 'Contents',
    tags: 'Tags',
    relatedPosts: 'Read next',
    relatedWorks: 'Works in this post',
    copyLink: 'Copy link',
    copied: 'Copied',
    shareX: 'Share on X',
    backToList: 'Back to the blog',
    minRead: '{n} min read',
    workPosts: 'Stories about this work',
  },
} as const;

export const postName = (entry: BlogEntry): string => entry.id.slice(entry.id.indexOf('/') + 1);
const postLang = (entry: BlogEntry): Lang => (entry.id.startsWith('en/') ? 'en' : 'ko');

export const postUrl = (lang: Lang, name: string): string => localePath(lang, `/blog/${name}/`);

export const minutesOf = (entry: BlogEntry): number => readMinutes(entry.body ?? '', postLang(entry));

export const postMeta = (entry: BlogEntry): PostMeta => ({
  id: postName(entry),
  lang: postLang(entry),
  title: entry.data.title,
  date: entry.data.date,
  category: entry.data.category,
  tags: entry.data.tags,
  excerpt: entry.data.excerpt,
  featured: entry.data.featured,
});

// 빌드할 때 한 번만 검사하면 되므로 결과를 모듈 안에 담아 둔다
let cache: Promise<BlogEntry[]> | undefined;

async function loadAll(): Promise<BlogEntry[]> {
  // 작품 상세가 /<slug>/ 루트 주소를 써서 slug가 blog인 작품이 생기면 블로그 목록 주소를 덮는다
  if (WORKS.some((w) => w.slug === 'blog')) throw new Error('작품 slug "blog"는 블로그 주소와 겹칩니다');
  const all = await getCollection('blog');
  const names = (lang: Lang) => all.filter((e) => postLang(e) === lang).map(postName);
  const orphans = findOrphans(names('ko'), names('en'));
  if (orphans.length > 0) throw new Error(`한국어판 없이 영어판만 있는 글: ${orphans.join(', ')}`);
  // 한국어판을 draft로 내리면 영어판도 함께 숨긴다
  const hidden = new Set(all.filter((e) => e.data.draft).map(postName));
  return all.filter((e) => !hidden.has(postName(e)));
}

export async function getPosts(lang: Lang): Promise<BlogEntry[]> {
  cache ??= loadAll();
  const list = (await cache).filter((e) => postLang(e) === lang);
  const order = sortPosts(list.map(postMeta)).map((m) => m.id);
  return order.map((id) => list.find((e) => postName(e) === id)).filter((e): e is BlogEntry => e !== undefined);
}

export async function hasTranslation(name: string, lang: Lang): Promise<boolean> {
  return (await getPosts(lang)).some((e) => postName(e) === name);
}

export function relatedWorks(entry: BlogEntry): Work[] {
  return entry.data.works.flatMap((slug) => {
    const work = WORKS.find((w) => w.slug === slug);
    // 작품을 내리거나 slug를 바꿔도 글 때문에 사이트 배포가 막히지 않게 링크만 뺀다
    if (!work) console.warn(`[blog] ${entry.id}: 없는 작품 slug "${slug}"`);
    return work ? [work] : [];
  });
}
