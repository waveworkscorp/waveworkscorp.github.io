// llms.txt(https://llmstxt.org) 본문을 만든다. AI 검색이 사이트 구조를 한 번에 읽도록 주요 주소만 적는다
export interface LlmsLink { title: string; url: string; note?: string }
export interface LlmsSection { heading: string; links: readonly LlmsLink[] }
export interface LlmsInput { title: string; summary: string; sections: readonly LlmsSection[] }

// 한 줄 목록 형식이 깨지지 않게 줄바꿈은 공백으로, 링크 글의 대괄호는 괄호로 바꾼다
const oneLine = (s: string): string => s.replace(/\s*\n\s*/g, ' ').trim();
const linkText = (s: string): string => oneLine(s).replace(/\[/g, '(').replace(/\]/g, ')');

const linkLine = (l: LlmsLink): string => `- [${linkText(l.title)}](${l.url})${l.note ? `: ${oneLine(l.note)}` : ''}`;

export function llmsTxt({ title, summary, sections }: LlmsInput): string {
  const body = sections
    .filter((s) => s.links.length > 0)
    .map((s) => [`## ${oneLine(s.heading)}`, '', ...s.links.map(linkLine)].join('\n'));
  return [`# ${oneLine(title)}`, `> ${oneLine(summary)}`, ...body].join('\n\n') + '\n';
}
