import { test } from 'node:test';
import assert from 'node:assert/strict';
import { llmsTxt } from './llms-core.ts';

test('llmsTxt: 제목·요약·절·링크를 llms.txt 형식으로 적는다', () => {
  const txt = llmsTxt({
    title: 'WaveWorks',
    summary: 'A small studio.',
    sections: [
      { heading: 'Works', links: [{ title: 'Bus Loop Escape', url: 'https://example.com/bus-jam/', note: 'A bus puzzle' }] },
      { heading: 'Optional', links: [{ title: 'Sitemap', url: 'https://example.com/sitemap.xml' }] },
    ],
  });
  assert.equal(txt, [
    '# WaveWorks',
    '',
    '> A small studio.',
    '',
    '## Works',
    '',
    '- [Bus Loop Escape](https://example.com/bus-jam/): A bus puzzle',
    '',
    '## Optional',
    '',
    '- [Sitemap](https://example.com/sitemap.xml)',
    '',
  ].join('\n'));
});

test('llmsTxt: 링크가 없는 절은 빼고, 줄바꿈과 대괄호는 한 줄 글로 다듬는다', () => {
  const txt = llmsTxt({
    title: 'T',
    summary: 'line1\nline2',
    sections: [
      { heading: 'Empty', links: [] },
      { heading: 'A', links: [{ title: 'x [y]', url: 'https://e.com/', note: 'a\nb' }] },
    ],
  });
  assert.doesNotMatch(txt, /## Empty/);
  assert.match(txt, /^> line1 line2$/m);
  assert.match(txt, /^- \[x \(y\)\]\(https:\/\/e.com\/\): a b$/m);
});
