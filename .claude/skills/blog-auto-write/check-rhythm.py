#!/usr/bin/env python3
"""블로그 본문의 문장 호흡을 잰다. 사용법: python3 check-rhythm.py <글.md> [...]
보조 신호일 뿐이고 합격 여부는 소리 내어 읽는 점검이 정한다(SKILL.md §9-3)."""
import re, sys

SHORT = 40       # 이 글자 수 미만이면 짧은 문장
RUN = 3          # 짧은 문장이 이만큼 이어지면 끊기는 구간
AVG_MIN = 45     # 평균이 이보다 짧으면 경고
SHORT_RATIO_MAX = 45  # 짧은 문장 비율(%)이 이보다 크면 경고

def body_sentences(text):
    parts = text.split('---', 2)
    body = parts[2] if len(parts) == 3 else text
    body = re.sub(r'```.*?```', '', body, flags=re.S)
    paras = [l.strip() for l in body.split('\n')
             if l.strip() and not l.lstrip().startswith(('#', '|', '!', '- ', '> ', '1.'))]
    return [[s.strip() for s in re.split(r'(?<=[.?])\s+', p) if s.strip()] for p in paras]

def main(paths):
    for path in paths:
        paras = body_sentences(open(path, encoding='utf-8').read())
        flat = [s for p in paras for s in p]
        if not flat:
            print(f'{path}: 문장 없음'); continue
        lens = [len(s) for s in flat]
        avg = sum(lens) / len(lens)
        ratio = 100 * sum(1 for n in lens if n < SHORT) / len(lens)
        print(f'{path}\n  문장 {len(flat)}개, 평균 {avg:.0f}자, {SHORT}자 미만 {ratio:.0f}%, 문단당 {len(flat)/len(paras):.1f}문장')
        runs = []
        for p in paras:
            n = 0
            for i, s in enumerate(p):
                n = n + 1 if len(s) < SHORT else 0
                if n == RUN:
                    runs.append(p[i - RUN + 1][:40])
        if avg < AVG_MIN: print(f'  경고: 평균 문장이 {AVG_MIN}자보다 짧음')
        if ratio > SHORT_RATIO_MAX: print(f'  경고: 짧은 문장 비율이 {SHORT_RATIO_MAX}%보다 높음')
        for r in runs: print(f'  끊기는 구간(짧은 문장 {RUN}개 연속): "{r}…"')
        if not runs: print('  끊기는 구간 없음')

if __name__ == '__main__':
    main(sys.argv[1:])
