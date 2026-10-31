---
name: blog-auto-write
description: 웨이브웍스 회사 블로그에 글 한 편을 주제 한 줄로 쓴다. 카테고리·slug·frontmatter·본문(한국어, 기본으로 영어판)·Codex 표지·빌드 검증·로컬 커밋·미리보기까지 하고, 사용자가 "올려"라고 하면 push한다. "블로그 글 써줘", "이 주제로 글", "/blog-auto-write <주제>", "출시 소식 글", "제작기 써줘"일 때 사용한다.
argument-hint: <주제 한 줄> [한국어만]
---

# /blog-auto-write

입력: `$ARGUMENTS`

웨이브웍스 회사 사이트(Astro, `src/content/blog/`)에 글 한 편을 더한다. 뼈대는 hongmacho-blog의 `/auto-blog-write`이고, 회사 말투·사실 규칙·영어판·표지·승인 뒤 공개를 더했다. 설계: `docs/superpowers/specs/2026-10-31-blog-design.md` §5.

입력이 비어 있으면 "주제를 한 줄 적어 주세요"라고만 답하고 멈춘다.

## 1. 입력 해석

- 주제 한 문장, 다룰 작품(있으면 작품 slug), 글의 각도(출시 소식, 제작 회고, 실험기, 팀 문화)를 정한다.
- 입력에 "한국어만"이 있으면 영어판을 만들지 않는다.

## 2. 카테고리

| 값 | 이름 | 쓰는 글 | 분량(한국어) |
|---|---|---|---|
| `news` | 소식 | 출시, 업데이트, 회사 소식 | 1,000~2,000자 |
| `culture` | 문화 | 일하는 방식, 도구, 회고 | 2,000~4,000자 |
| `making` | 제작기 | 게임·앱을 만든 과정, 기술 결정 | 4,000~6,000자 |

판단할 수 없을 때만 AskUserQuestion으로 한 번 묻는다.

## 3. 사실 모으기

수치·날짜·평점·출시 여부·기능은 아래에서만 가져온다. 근거가 없으면 문장을 빼거나 사용자에게 묻는다. 쓴 사실마다 출처를 적어 두었다가 보고에 넣는다.

| 출처 | 쓰는 내용 |
|---|---|
| `../../apps/<id>/site/site.json` | 이름, 한 줄 소개, 기능, 지원 기기·언어, 광고·구매, 스토어 |
| `../../apps/<id>/docs/STATE.md` | 출시일, 버전, 진행 단계 |
| `src/data/pages.ts` 연혁 | 회사 연혁 |
| `../../docs/portfolio.md` | 작품 목록과 단계 (STATE와 다르면 STATE를 따르고 보고에 적음) |
| 사용자 입력 | 그 밖의 사실 |

- 사이트의 작품 slug는 `src/data/works.json`에 있다. `works`에는 여기 있는 값만 넣는다.
- 매출, 다운로드 수, 지표는 사용자가 준 값만 쓴다.

## 4. 파일 이름과 날짜

```bash
TZ=Asia/Seoul date +%Y-%m-%d
ls src/content/blog/ko/
```

- slug: 영문 kebab-case 6단어 이내. 같은 이름이 있으면 `-2`, `-3`.
- 한국어 `src/content/blog/ko/<날짜>-<slug>.md`, 영어 `src/content/blog/en/`에 같은 파일 이름.
- 표지 `src/assets/blog/<날짜>-<slug>/cover.jpg`.

## 5. frontmatter

```yaml
---
title: "제목 (35자 이내, 따옴표)"
date: "YYYY-MM-DD"
category: news
excerpt: "140자 이하 한 문장. 글에서 가장 구체적인 사실을 꺼냄"
tags: ["태그1", "태그2"]
cover: ../../../assets/blog/YYYY-MM-DD-slug/cover.jpg
coverAlt: "표지 그림 설명"
works: ["bus-jam"]
featured: false
draft: false
---
```

- tags 1~5개. 영어판은 태그도 영어로 쓴다.
- cover가 없으면 cover·coverAlt 줄을 지운다. cover가 있으면 coverAlt는 필수다.
- 읽는 시간은 빌드가 계산하므로 쓰지 않는다.
- featured는 사용자가 말할 때만 true.

## 6. 본문 (한국어)

- 합니다체. 주어는 "우리" 또는 "웨이브웍스". 개인 1인칭과 반말은 쓰지 않는다.
- h2 3~6개, h3는 필요할 때만. 첫 h2 앞에 도입 문단 1~2개를 둔다.
- 섹션마다 구체적인 것 하나 이상: 숫자, 날짜, 표, 화면 그림, 코드.
- 마지막 섹션은 다음 계획이나 남은 과제로 닫는다.
- 본문 그림은 같은 폴더 그림(`./`가 아닌 `../../../assets/blog/<이름>/파일`) 또는 `/works/<id>/shots/ko-1.jpg` 같은 사이트 그림을 쓴다.

금기 문장(나오면 지우고 다시 씀):

- "안녕하세요", "여러분", "오늘은", "이번 글에서는", "~에 대해 알아보겠습니다"
- "정리하면", "결론적으로", "In conclusion"
- 헤더 "맺음말", "결론", "마치며"
- 이모지, 감탄 연발, "X가 아니라 Y" 대비

다 쓴 뒤 `writing-pipeline` 스킬 표에 따라 한국어 윤문 스킬 하나를 돌린다(블로그는 `humanizer-ko`). 수치·날짜·이름은 윤문 중 바꾸지 않는다.

## 7. 영어판

- 한국어판을 옮긴 뒤 `humanizer-en` 규칙으로 다듬는다. 직역 말투를 남기지 않는다.
- 작품 이름은 site.json의 `name.en`을 쓴다.
- 영어판만 있는 글은 빌드가 막으므로 한국어판을 먼저 둔다.

## 8. 표지

1. `codex-delegation` 스킬로 한도를 확인하고 한 줄로 알린다. 한도가 막히면 표지 없이 진행한다.
2. `cover-prompt.md`의 문장에 주제 장면을 채워 `codex exec`로 이미지를 만든다.
3. 결과는 `~/.codex/generated_images/<세션>/`에 생긴다. `cp`로 가져온다(`mv`·`rm` 금지, 원본은 남김).
4. 폴더를 만들고 sharp로 1600×900에 맞춰 자른다.

```bash
mkdir -p src/assets/blog/<이름>
node -e "require('sharp')(process.argv[1]).resize(1600,900,{fit:'cover'}).jpeg({quality:85}).toFile(process.argv[2])" <원본> src/assets/blog/<이름>/cover.jpg
```

5. 그림 안에 글자가 들어갔으면 한 번 다시 만든다. 그래도 있으면 표지 없이 진행한다.
6. 실패하면 cover 없이 진행하고 보고에 "표지 미생성"과 이유를 적는다. 목록은 카테고리 색 상자로 자리를 채운다.

## 9. 빌드 (최대 3회)

```bash
npx astro build 2>&1 | tail -30
```

- frontmatter 위반(excerpt 길이, category, date, tags 수, coverAlt 누락) → 고치고 다시 빌드.
- `[blog] ... 없는 작품 slug` 경고 → works 값을 고친다.
- 내 파일과 무관한 빌드 오류 → 멈추고 보고.
- 3회 실패하면 멈추고 마지막 오류 30줄을 보여 준다. 파일은 지우지 않는다.

## 10. 커밋과 미리보기

```bash
git add src/content/blog/ko/<이름>.md   # 영어판·표지는 실제로 만든 경우에만 경로를 덧붙인다
git commit -m "post: <제목>"
npx astro preview --port 4329   # run_in_background로 띄운다
open -a Aside http://localhost:4329/blog/<이름>/
```

- 경로를 하나씩 지정해 add한다. 만든 파일만 넣는다(영어판 `src/content/blog/en/<이름>.md`, 표지 `src/assets/blog/<이름>/cover.jpg`). 없는 경로를 넣으면 add가 실패한다. `.omc/`는 넣지 않는다.
- 이 단계에서는 push하지 않는다.

## 11. 공개 (사용자가 "올려"라고 한 뒤에만)

```bash
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -q origin HEAD:main HEAD:astro-site
gh run list -R waveworkscorp/waveworkscorp.github.io -L 1
```

- 배포 실행이 success가 되면 공개 주소(`https://waveworkscorp.github.io/blog/<이름>/`)를 알린다.
- 미리보기 서버를 끈다.

## 12. 보고

- 파일 경로(ko, en, 표지)
- 카테고리, 태그, 한국어 본문 글자 수(`wc -m`)
- 표지 생성 여부
- 사실 출처 목록(문장 → 파일)
- 빌드 재시도 횟수, 커밋 SHA, 미리보기 주소
- 공개 승인 요청은 AskUserQuestion으로 묻는다("올려" / "고칠 곳 있음").
