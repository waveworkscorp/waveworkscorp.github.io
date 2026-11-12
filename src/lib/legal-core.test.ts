import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromeLang, docHref, htmlLangOf, langLinks, ogLocale, stripLangPrefix, toRoute } from './legal-core.ts';

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

test('docHref: 문서 탭은 같은 언어판이 있으면 그것을, 없으면 화면 틀 언어판을 가리킨다', () => {
  const deletion = { ko: '/a/deletion/', en: '/en/a/deletion/', ja: '/ja/a/deletion/' };
  assert.equal(docHref(deletion, 'ja'), '/ja/a/deletion/');
  assert.equal(docHref(deletion, 'zh-hans'), '/en/a/deletion/');
  assert.equal(docHref(deletion, 'ko'), '/a/deletion/');
});

test('htmlLangOf: ko·en 문서는 글꼴 규칙이 맞도록 ko·en으로, 추가 언어는 원문 값 그대로', () => {
  assert.equal(htmlLangOf('<html lang="en-US"><body>', 'en'), 'en');
  assert.equal(htmlLangOf('<html lang="zh-Hant"><body>', 'zh-hant'), 'zh-Hant');
  assert.equal(htmlLangOf('<html><body>', 'ja'), 'ja');
});

test('ogLocale: 문서 언어에 맞는 공유 미리보기 locale', () => {
  assert.deepEqual(['ko', 'en', 'ja', 'zh-Hans', 'zh-hant'].map(ogLocale), ['ko_KR', 'en_US', 'ja_JP', 'zh_CN', 'zh_TW']);
});

test('stripLangPrefix: 법률 문서 언어 접두어를 모두 뗀다', () => {
  assert.deepEqual(['en/a/p', 'zh-hans/a/p', 'a/p'].map(stripLangPrefix), ['a/p', 'a/p', 'a/p']);
});

test('langLinks: 언어판마다 hreflang 값을 준다', () => {
  const links = langLinks({ ko: '/a/p/', en: '/en/a/p/', 'zh-hant': '/zh-hant/a/p/' }, '/a/p/');
  assert.deepEqual(links.map((l) => l.hreflang), ['ko', 'en', 'zh-Hant']);
});
