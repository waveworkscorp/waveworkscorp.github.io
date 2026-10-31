// Astro에 기대지 않는 순수 함수만 둔다. node --test로 바로 돌리기 위해서다
export type BlogLang = 'ko' | 'en';

export interface PostMeta {
  id: string;
  lang: BlogLang;
  title: string;
  date: string;
  category: string;
  tags: readonly string[];
  excerpt: string;
  featured: boolean;
}

export interface SearchEntry {
  url: string;
  title: string;
  excerpt: string;
  tags: readonly string[];
  category: string;
}

const KO_CHARS_PER_MIN = 600;
const EN_WORDS_PER_MIN = 200;

export function readMinutes(body: string, lang: BlogLang): number {
  const amount = lang === 'ko'
    ? body.replace(/\s/g, '').length
    : body.split(/\s+/).filter(Boolean).length;
  const perMin = lang === 'ko' ? KO_CHARS_PER_MIN : EN_WORDS_PER_MIN;
  return Math.max(1, Math.ceil(amount / perMin));
}

const byDateDesc = (a: PostMeta, b: PostMeta): number => b.date.localeCompare(a.date);

export function sortPosts(list: readonly PostMeta[]): PostMeta[] {
  return [...list].sort((a, b) => byDateDesc(a, b) || b.id.localeCompare(a.id));
}

// 무작위로 고르면 빌드마다 결과가 달라져 같은 글을 다시 배포해도 화면이 바뀐다
export function relatedPosts(target: PostMeta, all: readonly PostMeta[], limit = 3): PostMeta[] {
  const overlap = (p: PostMeta) => p.tags.filter((t) => target.tags.includes(t)).length;
  const sameCat = (p: PostMeta) => (p.category === target.category ? 1 : 0);
  return all
    .filter((p) => p.lang === target.lang && p.id !== target.id)
    .sort((a, b) => sameCat(b) - sameCat(a) || overlap(b) - overlap(a) || byDateDesc(a, b) || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function findOrphans(ko: readonly string[], en: readonly string[]): string[] {
  return en.filter((name) => !ko.includes(name));
}

// 한국어판이 원본이라 한국어판을 내리면 영어판도 숨긴다. 영어판 draft는 그 글만 빠진다
export function hiddenPostNames(posts: readonly { name: string; lang: BlogLang; draft: boolean }[]): Set<string> {
  return new Set(posts.filter((p) => p.draft && p.lang === 'ko').map((p) => p.name));
}

export function searchPosts(query: string, index: readonly SearchEntry[]): SearchEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...index];
  return index.filter((e) => {
    const hay = [e.title, e.excerpt, e.category, ...e.tags].join(' ').toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

// 날짜만 적힌 frontmatter를 UTC로 읽으면 미국 시간대 빌드에서 하루 앞 날짜가 찍힌다
export function formatDate(date: string, lang: BlogLang): string {
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'Asia/Seoul', dateStyle: 'medium' })
    .format(new Date(`${date}T00:00:00+09:00`));
}
