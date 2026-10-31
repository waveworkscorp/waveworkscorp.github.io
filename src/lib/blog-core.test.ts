import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findOrphans, formatDate, hiddenPostNames, readMinutes, relatedPosts, searchPosts, sortPosts, type PostMeta, type SearchEntry } from './blog-core.ts';

const post = (over: Partial<PostMeta>): PostMeta => ({
  id: 'x', lang: 'ko', title: '', date: '2026-10-01', category: 'news', tags: [], excerpt: '', featured: false, ...over,
});

test('readMinutes: 한국어는 공백 뺀 600자에 1분', () => {
  assert.equal(readMinutes('가'.repeat(1200), 'ko'), 2);
  assert.equal(readMinutes('가 '.repeat(1300), 'ko'), 3);
});

test('readMinutes: 빈 본문도 최소 1분', () => {
  assert.equal(readMinutes('', 'ko'), 1);
  assert.equal(readMinutes('', 'en'), 1);
});

test('readMinutes: 영어는 200단어에 1분', () => {
  assert.equal(readMinutes('word '.repeat(450), 'en'), 3);
});

test('relatedPosts: 같은 카테고리에서 태그가 많이 겹치는 글이 앞', () => {
  const target = post({ id: 't', tags: ['a', 'b'] });
  const all = [
    target,
    post({ id: 'one', tags: ['a'], date: '2026-10-05' }),
    post({ id: 'two', tags: ['a', 'b'], date: '2026-09-01' }),
    post({ id: 'other', category: 'culture', tags: ['a', 'b'], date: '2026-10-09' }),
    post({ id: 'en', lang: 'en', tags: ['a', 'b'] }),
  ];
  assert.deepEqual(relatedPosts(target, all).map((p) => p.id), ['two', 'one', 'other']);
});

test('relatedPosts: 같은 입력이면 늘 같은 결과', () => {
  const target = post({ id: 't' });
  const all = [target, post({ id: 'b' }), post({ id: 'a' }), post({ id: 'c' })];
  assert.deepEqual(relatedPosts(target, all), relatedPosts(target, all));
  assert.deepEqual(relatedPosts(target, all).map((p) => p.id), ['a', 'b', 'c']);
});

test('sortPosts: 최신 날짜가 앞', () => {
  const list = [post({ id: 'a', date: '2026-01-01' }), post({ id: 'b', date: '2026-03-01' })];
  assert.deepEqual(sortPosts(list).map((p) => p.id), ['b', 'a']);
});

test('findOrphans: 영어에만 있는 파일명', () => {
  assert.deepEqual(findOrphans(['a', 'b'], ['b', 'c']), ['c']);
});

const idx: SearchEntry[] = [
  { url: '/1', title: '버스잼 출시', excerpt: '', tags: ['Unity'], category: 'news' },
  { url: '/2', title: '출시 회고', excerpt: '', tags: ['회고'], category: 'making' },
  { url: '/3', title: 'Unity 이주', excerpt: '', tags: [], category: 'making' },
];

test('searchPosts: 빈 질의는 전체', () => {
  assert.equal(searchPosts('   ', idx).length, idx.length);
});

test('searchPosts: 낱말을 모두 포함하고 대소문자는 무시', () => {
  assert.deepEqual(searchPosts('unity 출시', idx).map((e) => e.url), ['/1']);
});

test('formatDate: 서울 날짜 기준', () => {
  assert.equal(formatDate('2026-11-01', 'en'), 'Nov 1, 2026');
  assert.equal(formatDate('2026-11-01', 'ko'), '2026. 11. 1.');
});

test('hiddenPostNames: 한국어판 draft는 두 언어를 모두 숨기고 영어판 draft는 영어판만 숨김', () => {
  const posts = [
    { name: 'a', lang: 'ko' as const, draft: true },
    { name: 'a', lang: 'en' as const, draft: false },
    { name: 'b', lang: 'ko' as const, draft: false },
    { name: 'b', lang: 'en' as const, draft: true },
  ];
  assert.deepEqual([...hiddenPostNames(posts)], ['a']);
});
