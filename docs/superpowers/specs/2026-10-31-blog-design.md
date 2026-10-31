# 웨이브웍스 블로그 설계

작성 2026-10-31. 대상 저장소 `sites/waveworks-site`(Astro 7.3.8, ko/en, React·Tailwind 없음).

## 1. 의도

회사 사이트 상단 메뉴에 Blog를 더한다. 글은 사용자가 예전에 만든 개인 블로그 `hongmacho-blog`(`/Users/hongpaul/develop/project-persnol/hongmacho-blog`)처럼 정해진 frontmatter를 가진 md 파일로 쓰고, 주제만 주면 Claude가 글을 써 주는 스킬을 이 사이트에 맞게 고쳐서 쓴다. 기능을 하나하나 새로 만드는 대신 md 파일만 추가하면 블로그가 늘어나는 구조가 목적이다.

레퍼런스: 111퍼센트 채용 블로그(https://111percent.teamblog.io/). Culture·People·Company 3분류, 16:9 표지, 목차, 공유, 최신 글 카드. 슈퍼센트 Medium은 자동 접근이 막혀 보지 못했다.

## 2. 목표 / 비목표 / 실패 조건

목표
- 제작 이야기, 게임·앱 소식, 회사 문화·채용을 한 블로그에서 다룬다(사용자 결정).
- md 파일 하나(+표지 그림)를 넣으면 목록·글 화면·검색·관련 글이 자동으로 따라온다.
- 스킬 하나로 주제 → 글(ko, 선택적으로 en) → 표지 → 빌드 → 커밋 → 미리보기까지 가고, 사용자 승인 뒤 push한다.

비목표 (사용자가 기능 선택에서 고르지 않음, 2026-10-31)
- 댓글(Giscus), RSS, 다크 모드·본문 폭 선택. 근거: 플레이어는 GitHub 계정이 거의 없고, 다크 모드는 사이트 전체에 없는 기능이라 블로그만 넣으면 화면이 어긋난다. RSS는 사용자가 넣지 않기로 했다.
- hongmacho-blog의 히어로 배경 12종, React 부품.

실패 조건 (기술적으로 돌아가도 실패로 본다)
- 근거 없는 수치·출시일·평점이 회사 이름으로 공개된다.
- 블로그 화면만 사이트 다른 화면과 다른 디자인으로 보인다.
- 사용자 승인 없이 글이 공개된다.

## 3. 제약

- 사이트 규칙(`CLAUDE.md`): 두 언어 문구는 함께 바뀐다. 작품 페이지 사실은 앱의 `site/site.json`에서만 온다. `git add`는 경로로. `.omc/` 커밋 금지. push = GitHub Pages 공개 배포.
- 작품 상세가 루트 `/[slug]/`를 쓴다. `blog`라는 작품 slug가 생기면 주소가 겹친다.
- 사이트 스타일: `src/styles/global.css`의 `--ink`·`--wave`·`--sun` 등 토큰, 3px 테두리와 `--pop` 그림자, Pretendard·Black Han Sans·Fredoka.
- 루트 규칙: UI 결정은 비교 HTML(`docs/compare/<topic>.html`)을 열고 고르게 한다.

## 4. 방식 비교 (사용자 선택: A)

| 방식 | 단기 | 장기 | 내용 |
|---|---|---|---|
| A. 사이트 안에 직접 구현 | 7/10 | 9/10 | hongmacho-blog의 스키마·폴더 규칙·prose.css만 가져오고 화면은 회사 사이트 스타일 Astro 부품으로 새로 쓴다. 메뉴·언어 전환·배포가 하나다. |
| B. hongmacho-blog를 복제해 별도 사이트로 `/blog`에 배포 | 8/10 | 4/10 | 화면 작업은 적지만 디자인·헤더·배포가 둘로 갈리고 영어판이 없다. 결국 A로 다시 옮기게 된다. |

외부 플랫폼(teamblog.io, Medium)은 md 파일·스킬 요구와 맞지 않아 뺐다.

## 5. 정해진 내용

### 5.1 글 파일과 주소

- 한국어: `src/content/blog/ko/YYYY-MM-DD-<slug>.md` → `/blog/YYYY-MM-DD-<slug>/`
- 영어(선택): `src/content/blog/en/` 아래 같은 파일명 → `/en/blog/YYYY-MM-DD-<slug>/`. 파일명이 같으면 짝이다(사용자 결정: 한국어 필수, 영어 선택).
- 영어판이 없는 글은 영어 목록·검색에 나오지 않는다. 그 글에서 언어를 EN으로 바꾸면 `/en/blog/`로 간다.
- 영어판만 있는 글은 빌드 실패로 막는다.
- slug: 영문 kebab-case, 6단어 이내. 같은 이름이 있으면 `-2`, `-3`.

### 5.2 frontmatter

hongmacho-blog 스키마(`src/content.config.ts`)를 바탕으로 회사용 필드를 더한다.

```yaml
title: "제목"              # 필수, 따옴표
date: "2026-11-01"        # 필수, YYYY-MM-DD (KST 기준 날짜)
category: making          # 필수, making | news | culture
excerpt: "140자 이하 한 문장"  # 필수
tags: ["Unity", "출시"]    # 필수, 1~5개
cover: ../../../assets/blog/2026-11-01-<slug>/cover.png  # 선택, Astro image()
coverAlt: "표지 설명"       # cover가 있으면 필수
works: ["bus-jam"]        # 선택, 관련 작품 slug. WORKS에 없는 값은 빌드 경고 후 링크만 뺌
featured: false           # 선택, true면 목록 맨 위 큰 카드
draft: false              # 선택, true면 빌드에서 빠짐
```

- readTime은 frontmatter에 두지 않고 빌드가 본문 글자 수로 계산한다(한국어 600자/분, 영어 200단어/분, 최소 1분). hongmacho-blog는 계산 함수를 만들어 놓고 호출하지 않았다.
- 날짜 표시는 `timeZone: 'Asia/Seoul'`을 고정한다. hongmacho-blog는 빌드 컴퓨터 시간대를 따라 하루 밀릴 수 있었다.
- 카테고리 이름·설명·색은 `src/data/blog.ts`에 ko/en으로 둔다. Claude 제안: making=제작기(`--wave`), news=소식(`--tang`), culture=문화(`--coral`).

### 5.3 이미지

- 위치: `src/assets/blog/<파일명>/`. ko/en 글이 같은 그림을 쓴다. Astro 이미지 처리로 크기별 출력.
- 표지: 스킬이 Codex로 생성한다(사용자 결정). 규칙은 스킬 문서에 고정한다: 16:9(1600×900), 그림 안에 글자 없음, 사이트 로고 색(`--ink`·`--wave`·`--sky`·`--sun`·`--tang`), 입체감 있는 일러스트. 생성 전 `codex-delegation` 스킬로 한도를 확인한다.
- Codex 한도가 없거나 생성이 실패하면 글은 멈추지 않고 cover 없이 진행하고, 보고에 "표지 미생성"을 남긴다. 표지가 없는 글은 카테고리 색 상자와 카테고리 이름으로 자리를 채운다.
- og 이미지: cover가 있으면 cover, 없으면 사이트 기본 이미지.
- 본문 그림: md 상대 경로로 같은 폴더 그림을 넣는다. 소식 글은 `public/works/<id>/`의 스크린샷을 써도 된다.

### 5.4 화면

- 상단 메뉴: Works · Blog · About · Contact(Claude 판단, 고칠 수 있음). `Base.astro`의 `nav`에 추가하고 `/blog/` 아래에서 Blog가 켜진다.
- 목록 `/blog/`, `/en/blog/`: featured 큰 카드 1개 + 표지 카드 격자. 카테고리 탭(전체·제작기·소식·문화)과 태그 필터는 `?cat=`, `?tag=` 쿼리를 작은 스크립트로 처리한다. 검색창이 목록 위에 있다.
- 글 `/blog/<name>/`: 카테고리, 제목, 날짜·읽는 시간, 표지, 본문(prose), 목차(h2·h3, 화면 넓을 때 옆, 좁을 때 위 접이식), 태그, 관련 작품 카드(`works`), 링크 복사·X 공유, 관련 글 3개.
- 관련 글: 같은 카테고리에서 겹치는 태그 수가 많은 순, 같으면 최신 순. 빌드마다 결과가 같다(hongmacho-blog는 무작위였다).
- 검색: 빌드 때 언어별 `/blog/search.json`(제목·요약·태그·카테고리·주소)을 만들고 목록 화면 스크립트가 불러와 찾는다. 본문은 검색하지 않는다. 별도 `/search` 페이지는 없다(hongmacho-blog의 정적 `/search`는 항상 빈 화면이었다).
- 본문 CSS: hongmacho-blog `src/styles/prose.css`(167줄)를 가져와 `--c-gray-*` 등 토큰을 사이트 토큰으로 바꾸고 다크 모드 규칙은 지운다. 코드 블록은 Astro 기본 Shiki.
- 화면 모양(목록 카드, 글 머리, 목차 위치)은 구현 첫 단계에서 비교 HTML 2~3안을 열고 사용자가 고른다.
- 작품 상세(`WorkDetail.astro`)에 그 작품을 `works`로 단 글이 있으면 "관련 글" 줄을 더한다.
- 작품 slug 목록에 `blog`가 있으면 빌드 실패로 막는다.
- sitemap은 지금 사이트에 없으므로 이번 범위가 아니다.

### 5.5 글쓰기 스킬 `blog-auto-write`

- 위치: `sites/waveworks-site/.claude/skills/blog-auto-write/SKILL.md`(이 저장소에 커밋). 사이트 세션에서 `/blog-auto-write <주제>`로 부른다(Claude 판단). 앱 사실을 읽으려고 `../../apps/<id>/` 파일을 읽는다.
- 뼈대: hongmacho-blog `.claude/commands/auto-blog-write.md`(입력 파싱 → 카테고리 → slug·날짜 → frontmatter → 본문 → 빌드 재시도 최대 3회 → 커밋 → 보고). 이름은 `blog-auto-write` 하나로 통일하고 다른 하나는 가져오지 않는다.
- 바꾸는 점
  - 톤: 합니다체, 주어는 "우리/웨이브웍스". 개인 1인칭 반말 금지. 금기 문장(인사, "알아보겠습니다", "결론적으로", "맺음말" 헤더, 이모지)은 그대로 가져온다.
  - 분량: 소식 1,000~2,000자, 문화 2,000~4,000자, 제작기 4,000~6,000자. h2 3~6개.
  - 사실 규칙: 수치·날짜·평점·출시 여부는 `apps/<id>/site/site.json`, 앱 `docs/STATE.md`, 루트 `docs/portfolio.md`, 사용자 입력에서만 가져오고, 쓴 수치마다 출처를 커밋 전 보고에 적는다. 근거가 없으면 문장을 빼거나 사용자에게 묻는다.
  - 카테고리를 판단할 수 없을 때만 한 번 묻는다.
  - 영어판: 기본으로 만든다. 입력에 "한국어만"이 있으면 건너뛴다. 영어판은 번역 뒤 `humanizer-en` 규칙으로 다듬는다. 한국어 본문은 `writing-pipeline` 표에 따라 윤문 스킬 하나를 돌린다.
  - 표지: §5.3대로 생성.
  - 끝 단계(사용자 결정): 빌드 통과 → 경로 지정 `git add` → 커밋(`post: <제목>`) → `npx astro preview`로 글 주소를 `open -a Aside`로 연다 → 사용자가 "올려"라고 하면 CLAUDE.md의 push 명령으로 `main`과 `astro-site`에 push하고 배포 실행을 확인한다. 승인 전에는 push하지 않는다.
- 보고: 파일 경로, 카테고리·태그, 글자 수, 표지 생성 여부, 수치 출처 목록, 빌드 재시도 횟수, 커밋 SHA, 미리보기 주소.

### 5.6 기존 글

hongmacho-blog의 글 30편은 개인 글이라 옮기지 않는다. 블로그는 빈 상태로 열지 않도록 첫 글 1편 이상을 스킬로 쓴 뒤 공개한다(Claude 제안).

## 5.7 검토 뒤 정한 것 (Claude 판단, 사용자가 추천안 위임 2026-10-31)

- 공개 시점: 블로그 코드는 로컬 커밋만 하고 push하지 않는다. 첫 글을 사용자가 승인하면 코드와 글을 한 번에 push한다.
- 스킬 위치: 사이트 폴더에서 연 세션 전용(`sites/waveworks-site/.claude/skills/`). 앱 자료는 사이트 폴더 기준 `../../apps/<id>/`로 읽는다. 루트 세션에서는 이 스킬이 보이지 않는다.
- 첫 글: 근거 자료가 있는 "스쿨버스 지옥탈출 Google Play 출시" 소식(news, ko+en)을 스킬로 쓴다. 사실은 `apps/bus-jam/site/site.json`과 소개 페이지 연혁에서만 가져온다.
- 언어 전환: 영어판이 없는 글은 `hreflang="en"` 링크를 내지 않고 EN 전환은 `/en/blog/`로 보낸다. `Base.astro`에 언어별 전환 경로를 덮어쓰는 prop을 더한다.
- 없는 작품 slug: `site:sync`가 작품 목록을 바꿔도 배포가 막히지 않게 빌드 경고만 내고 그 링크를 뺀다.
- 메뉴: 지금 Works는 루트가 아닌 모든 경로에서 켜지므로 `/blog/` 아래는 제외한다.
- og 이미지: `Base.astro`가 `/img/logo1.png`로 고정돼 있어 `ogImage` prop을 더한다.
- 표지 크기: Codex는 16:9를 바로 내지 않으므로 가로형으로 생성한 뒤 sharp(astro에 포함)로 1600×900에 맞춰 자른다. 생성 파일은 `cp`로 가져온다(`mv`·`rm`은 hookify 규칙이 막음).

## 6. 구현자에게 맡기는 것

- 컴포넌트 나누기(파일당 300줄 이하), 스크립트 구조, CSS 클래스 이름.
- 비교 HTML 안의 구체 디자인 후보.
- Astro 7 content collection API의 세부 사용법(glob loader, `image()`, `render()`).
