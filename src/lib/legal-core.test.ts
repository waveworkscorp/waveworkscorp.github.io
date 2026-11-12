import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromeLang, langLinks, toRoute } from './legal-core.ts';

test('toRoute: ko는 접두어 없이, 다른 언어는 언어 접두어를 붙인다', () => {
  assert.deepEqual(toRoute('../legal/ko/a/privacy.html'), { route: 'a/privacy', docLang: 'ko' });
  assert.deepEqual(toRoute('../legal/zh-hant/a/privacy.html'), { route: 'zh-hant/a/privacy', docLang: 'zh-hant' });
  assert.deepEqual(toRoute('../legal/en/privacy.html'), { route: 'en/privacy', docLang: 'en' });
});

test('chromeLang: 한국어 문서만 한국어 화면 틀, 나머지는 영어', () => {
  assert.equal(chromeLang('ko'), 'ko');
  assert.equal(chromeLang('ja'), 'en');
  assert.equal(chromeLang('zh-hans'), 'en');
});

test('langLinks: 문서에 있는 언어만 정해진 순서로, 지금 문서에 표시', () => {
  const links = langLinks({ ja: '/ja/a/p/', ko: '/a/p/', en: '/en/a/p/' }, '/ja/a/p/');
  assert.deepEqual(links.map((l) => l.label), ['한국어', 'English', '日本語']);
  assert.deepEqual(links.map((l) => l.current), [false, false, true]);
});

test('langLinks: 같은 주소를 가리키는 언어는 한 번만 둔다(영어 한 장짜리 건강 데이터 방침)', () => {
  const links = langLinks({ ko: '/en/a/health-data/', en: '/en/a/health-data/' }, '/en/a/health-data/');
  assert.equal(links.length, 1);
});
