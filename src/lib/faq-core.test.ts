import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INFO_QUESTIONS, buildFaq } from './faq-core.ts';

const t = (ko: string, en: string) => ({ ko, en });
const row = (label: string, labelEn: string, value: string, valueEn: string) => ({ label: t(label, labelEn), value: t(value, valueEn) });

test('buildFaq: 직접 쓴 faq를 먼저, info 줄로 만든 문답을 뒤에 둔다', () => {
  const work = {
    name: t('알파', 'Alpha'),
    faq: [{ q: t('무료?', 'Free?'), a: t('네', 'Yes') }],
    info: [{ rows: [row('광고', 'Ads', '보상형', 'Rewarded')] }],
  };
  assert.deepEqual(buildFaq(work, 'ko').entries, [{ q: '무료?', a: '네' }, { q: '알파에 광고가 있나요?', a: '보상형' }]);
  assert.deepEqual(buildFaq(work, 'en').entries[1], { q: 'Does Alpha have ads?', a: 'Rewarded' });
});

test('buildFaq: 모든 info 상자를 돈다', () => {
  const work = {
    name: t('알파', 'Alpha'),
    info: [{ rows: [row('지원 기기', 'Devices', '안드로이드', 'Android')] }, { rows: [row('저장 위치', 'Storage', '휴대폰', 'Phone')] }],
  };
  assert.equal(buildFaq(work, 'ko').entries.length, 2);
});

test('buildFaq: 질문표에 없는 라벨은 건너뛰고 알린다', () => {
  const work = { name: t('알파', 'Alpha'), info: [{ rows: [row('기타', 'Other', '값', 'Value')] }] };
  assert.deepEqual(buildFaq(work, 'ko'), { entries: [], unknownLabels: ['기타'] });
});

test('buildFaq: faq도 info도 없으면 비어 있다', () => {
  assert.deepEqual(buildFaq({ name: t('알파', 'Alpha') }, 'en'), { entries: [], unknownLabels: [] });
});

test('INFO_QUESTIONS: 사이트에서 쓰는 라벨 10개를 모두 담는다', () => {
  assert.deepEqual(Object.keys(INFO_QUESTIONS).sort(), ['공유 범위', '광고', '대상', '삭제 방법', '앱 내 구매', '연령 등급', '인터넷 연결', '저장 위치', '지원 기기', '지원 언어'].sort());
});
