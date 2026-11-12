Keywords: AEO, 답변 최적화, FAQ, 자주 묻는 질문, FAQPage, 작성자, 홍마초, 수정일, dateModified, site.json faq, site-sync, 구현 계획

# AEO Content Implementation Plan

## 한국어 요약

- 작업 6개: SEO 선커밋 → 루트 sync에 faq 필드 → FAQ 질문표·스키마 → 작품 페이지 FAQ 절 → 작성자·수정일 → 출시 글 소제목.
- 루트 저장소(sync)와 사이트 저장소에 나눠 로컬 커밋, push 없음.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Work pages get a visible FAQ and `FAQPage` JSON-LD; blog posts show author (홍마초) and updated date with matching `BlogPosting` fields; the launch post gets headings.

**Architecture:** Pure helpers in `src/lib/*-core.ts` (tested with `node --test`), wired into Astro components/pages. The optional `faq` field enters through the root `site:sync` model and lands in `works.json`.

**Tech Stack:** Astro 7.3.8, TypeScript, node:test (site), vitest (root `scripts/`).

**Spec:** `docs/superpowers/specs/2026-11-12-aeo-content-design.md`

## Global Constraints

- Site repo: `/Users/hongpaul/develop/project-persnol/ww-forge/sites/waveworks-corp` (branch `feat/blog`). Root repo: `/Users/hongpaul/develop/project-persnol/ww-forge`. Separate git repos, separate commits.
- Never hand-edit `src/data/works.json`, `public/works/`, `src/legal/{ko,en}/<id>/`.
- Build with `./node_modules/.bin/astro build` (not `npx`; npx fails on an unrelated workspace name clash).
- `git add` by path only; never `-A`/`.`; never commit `.omc/`, `docs/compare/`, `output/`. No push.
- ko and en copy change together. No new dependencies. No unverified facts.
- Author display: ko `홍마초`, en `Hongmacho`; bio ko `웨이브웍스에서 게임과 앱을 만듭니다.`, en `Makes games and apps at WaveWorks.` Real name must not appear in the byline.
- Root code style: strict TS, no `any`, kebab-case files, return new objects.

## Review Focus

1. Info label not in the question table (future apps) → skipped from FAQ, build prints a warning naming work and label; build does not fail. (Task 3 test `buildFaq skips unknown labels`.)
2. Work with no info and no faq → no FAQ section and no `FAQPage` script. (Task 3 test `buildFaq empty`; Task 4 dist check on a work.)
3. `updated` earlier than `date` → content schema error at build. (Task 5 refine; verified by a temporary bad post in Step 5.)
4. Post without `updated` → `dateModified` equals `date`, no updated text shown. (Task 5 test.)
5. Answer text containing `<` or quotes → JSON-LD stays parseable and does not break `</script>` (existing `<` escape in `Base.astro`; Task 4 dist parse check).

---

### Task 1: Commit the SEO basics already in the tree

**Files:** existing uncommitted site changes only.

- [ ] **Step 1: Verify** — `node --test src/lib/*.test.ts` → `pass 20, fail 0`; `./node_modules/.bin/astro build` → `Complete!`.
- [ ] **Step 2: Commit**

```bash
git add public/robots.txt src/data/rss.ts src/data/seo.ts src/lib/seo-core.ts src/lib/seo-core.test.ts src/pages/rss.xml.ts src/pages/en/rss.xml.ts src/pages/sitemap.xml.ts src/layouts/Base.astro 'src/pages/[slug].astro' 'src/pages/en/[slug].astro' 'src/pages/blog/[id].astro' 'src/pages/en/blog/[id].astro' src/pages/index.astro src/pages/en/index.astro docs/superpowers/specs/2026-11-12-aeo-content-design.md docs/superpowers/plans/2026-11-12-aeo-content.md
git commit -m "feat: SEO 기본 장치(canonical·sitemap·RSS·JSON-LD) 추가"
```

### Task 2: Optional `faq` field in site:sync (root repo)

**Files:**
- Modify: `scripts/site-sync/model.ts` (`SiteSource`, new `faqItems()`, `readSiteSource`)
- Modify: `scripts/site-sync/plan.ts` (`SiteWork.faq?`, mapping near line 58-60)
- Test: `scripts/site-sync/site-sync.test.ts`
- Modify: `docs/platform/site-sync.md` (field table row)

**Interfaces:**
- Produces: `works.json` entries may carry `faq: [{ q: {ko, en}, a: {ko, en} }]`, present only when non-empty.

- [ ] **Step 1: Write failing tests** in the `readSiteSource`/`desiredFiles` area, using existing `makeApp`/`siteJson` helpers:
  - `faq passes through to works.json`: site.json with `faq: [{ q: text('무료인가요?', 'Is it free?'), a: text('네', 'Yes') }]` → parsed `works.json` entry has `faq` deep-equal to that array.
  - `faq absent → no key`: default `siteJson()` → entry has no `faq` property.
  - `faq item missing en fails`: `faq: [{ q: { ko: '질문' }, a: text('답', 'A') }]` → `readSiteSource` throws, message contains `faq[0].q`.
- [ ] **Step 2: Run** `npx vitest run scripts/site-sync/site-sync.test.ts` → the 3 new tests FAIL.
- [ ] **Step 3: Implement** `faqItems(value: unknown, where: string): readonly FaqItem[]` (`FaqItem = { readonly q: Text; readonly a: Text }`, exported) mirroring `infoBoxes`; add `faq: readonly FaqItem[]` to `SiteSource`; in plan.ts add `readonly faq?: readonly FaqItem[]` and `...(source.faq.length > 0 ? { faq: source.faq } : {})`.
- [ ] **Step 4: Run** the test file → all PASS; then `npm run check` → passes.
- [ ] **Step 5: Docs** — add field-table row to `docs/platform/site-sync.md`: `` | `faq` | Optional. `[{q, a}]` with `{ko, en}` each. Shown first in the work page FAQ, before questions made from `info`. Confirmed facts only | ``.
- [ ] **Step 6: Verify no drift** — `npm run site:sync -- --check` → no differences (no app has `faq`).
- [ ] **Step 7: Commit (root repo)**

```bash
git add scripts/site-sync/model.ts scripts/site-sync/plan.ts scripts/site-sync/site-sync.test.ts docs/platform/site-sync.md
git commit -m "feat(site-sync): site.json 선택 faq 필드 추가"
```

### Task 3: FAQ question table and `FAQPage` builder (site repo)

**Files:**
- Create: `src/lib/faq-core.ts`, `src/lib/faq-core.test.ts`
- Modify: `src/lib/seo-core.ts`, `src/lib/seo-core.test.ts`
- Modify: `src/data/works.ts` (`Work.faq?: readonly { q: Text; a: Text }[]`)

**Interfaces:**
- Produces:
  - `type FaqText = Record<'ko' | 'en', string>`
  - `interface FaqSource { name: FaqText; faq?: readonly { q: FaqText; a: FaqText }[]; info?: readonly { rows: readonly { label: FaqText; value: FaqText }[] }[] }`
  - `interface FaqEntry { q: string; a: string }`
  - `buildFaq(work: FaqSource, lang: 'ko' | 'en'): { entries: FaqEntry[]; unknownLabels: string[] }`
  - `faqPageLd(url: string, entries: readonly FaqEntry[]): JsonLd` in seo-core.ts

- [ ] **Step 1: Write failing tests** (`faq-core.test.ts`):
  - `buildFaq authored first then info`: work `name {ko:'알파',en:'Alpha'}`, `faq [{q:{ko:'무료?',en:'Free?'},a:{ko:'네',en:'Yes'}}]`, info row `광고`/`Ads` value `보상형`/`Rewarded` → ko entries `[{q:'무료?',a:'네'},{q:'알파에 광고가 있나요?',a:'보상형'}]`; en second entry `{q:'Does Alpha have ads?',a:'Rewarded'}`.
  - `buildFaq walks every info box`: two boxes, label `지원 기기` in box 1 and `저장 위치` in box 2 → 2 entries.
  - `buildFaq skips unknown labels`: label `기타` → entries `[]`, `unknownLabels ['기타']`.
  - `buildFaq empty`: no faq/info → `{ entries: [], unknownLabels: [] }`.
  - `INFO_QUESTIONS covers the 10 labels`: keys deep-equal (sorted) `['공유 범위','광고','대상','삭제 방법','앱 내 구매','연령 등급','인터넷 연결','저장 위치','지원 기기','지원 언어']`.
  In `seo-core.test.ts`: `faqPageLd`: `@type 'FAQPage'`, `url`, `mainEntity[0]` deep-equal `{ '@type':'Question', name:'Q', acceptedAnswer:{ '@type':'Answer', text:'A' } }`.
- [ ] **Step 2: Run** `node --test src/lib/*.test.ts` → new tests FAIL.
- [ ] **Step 3: Implement** `INFO_QUESTIONS: Readonly<Record<string, Record<'ko'|'en', (name: string) => string>>>` keyed by ko label. Fixed by spec: `광고` → ko `${name}에 광고가 있나요?`, en `Does ${name} have ads?`. The other 9 follow the same pattern (builder writes; e.g. `지원 기기` → `${name}은 어떤 기기에서 쓸 수 있나요?` / `Which devices does ${name} run on?`). Then `buildFaq`, then `faqPageLd`; add `faq?` to `Work`.
- [ ] **Step 4: Run** tests → all PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/faq-core.ts src/lib/faq-core.test.ts src/lib/seo-core.ts src/lib/seo-core.test.ts src/data/works.ts
git commit -m "feat: 작품 FAQ 질문표와 FAQPage 구조화 데이터 생성"
```

### Task 4: FAQ section on work pages

**Files:**
- Modify: `src/components/WorkDetail.astro` (new section between `posts` section ~line 112 and `#docs` ~line 118)
- Modify: `src/data/i18n.ts` (`faqHead`: ko `자주 묻는 질문`, en `FAQ`)
- Modify: `src/data/seo.ts` (`workLd` appends `faqPageLd` when entries non-empty)

**Interfaces:**
- Consumes: `buildFaq`, `faqPageLd` (Task 3).
- Produces: `workLd(site, lang, work)` returns `[SoftwareApplication, FAQPage?]`.

- [ ] **Step 1: Implement** section `<section class="faq" aria-labelledby="faq-head"><h2 id="faq-head">{t.faqHead}</h2>` then per entry `<h3>` question and `<p>` answer, always expanded, styled like existing sections; render only when entries non-empty. In `workLd`, call `buildFaq`; for each `unknownLabels` item `console.warn(\`[faq] ${work.slug}: 질문표에 없는 info 라벨 "${label}"\`)` (build-time only).
- [ ] **Step 2: Build** → `Complete!`, no `[faq]` warnings (all 10 labels covered).
- [ ] **Step 3: Verify dist** — `dist/bus-jam/index.html` has `id="faq-head"` and 6 `<h3` inside the FAQ section; every `application/ld+json` block in `dist/*/index.html` and `dist/en/*/index.html` parses with `JSON.parse`; `dist/babylog/index.html` FAQPage has entries from both info boxes; `dist/en/bus-jam/index.html` questions are English.
- [ ] **Step 4: Mobile check** — preview (`./node_modules/.bin/astro preview --port 4329`), load `/bus-jam/` in a 390px iframe, FAQ section has no horizontal overflow; stop preview.
- [ ] **Step 5: Commit**

```bash
git add src/components/WorkDetail.astro src/data/i18n.ts src/data/seo.ts
git commit -m "feat: 작품 페이지에 자주 묻는 질문 절 추가"
```

### Task 5: Post author and updated date

**Files:**
- Modify: `src/content.config.ts` (optional `author` enum `['hongmacho']` default `'hongmacho'`; optional `updated` same format as `date`; refine `!updated || updated >= date`, message `updated는 date보다 앞설 수 없습니다`, path `['updated']`)
- Modify: `src/data/blog.ts` (`AUTHORS` with the constants in Global Constraints; strings `updatedOn` ko `{d} 수정`, en `Updated {d}`, `writtenBy` ko `글쓴이`, en `Written by`)
- Modify: `src/components/PostView.astro` (meta line, `<time datetime>`, author box above tags)
- Modify: `src/lib/seo-core.ts` + test (`BlogPostingInput` gains `author: { name: string; url: string }`, `dateModified: string`)
- Modify: `src/data/seo.ts` (`postLd` passes author name for lang, url = about page in that lang, `dateModified: updated ?? date`)
- Modify: `src/pages/sitemap.xml.ts` (post `lastmod` = `updated ?? date`)

- [ ] **Step 1: Update failing test** `blogPostingLd`: input adds `author: { name: '홍마초', url: 'https://example.com/about/' }`, `dateModified: '2026-11-12'`; expect `ld.author` deep-equal `{ '@type': 'Person', name: '홍마초', url: 'https://example.com/about/' }`, `ld.dateModified === '2026-11-12'`, `ld.publisher['@type'] === 'Organization'`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** seo-core change → PASS.
- [ ] **Step 4: Wire** config, AUTHORS, PostView (meta: `<time datetime={date}>` · updated text with `<time>` only when `updated` · read time; author box: name + bio), postLd, sitemap.
- [ ] **Step 5: Schema guard** — temporarily set `updated: "2026-10-01"` on a post with `date: "2026-10-31"`, build → fails with `updated는 date보다 앞설 수 없습니다`; revert.
- [ ] **Step 6: Build and verify dist** — a post without `updated`: `dateModified` equals `datePublished`, no `수정` text; byline shows `홍마초` (ko) / `Hongmacho` (en); `grep -c 홍바울 dist/blog/*/index.html` → all 0 (business-info footer, if any, excluded—check footer separately and report).
- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/data/blog.ts src/components/PostView.astro src/lib/seo-core.ts src/lib/seo-core.test.ts src/data/seo.ts src/pages/sitemap.xml.ts
git commit -m "feat: 블로그 글 작성자(홍마초)와 수정일 표시"
```

### Task 6: Headings in the launch post

**Files:** `src/content/blog/ko/2026-10-31-bus-loop-escape-launch.md`, `src/content/blog/en/2026-10-31-bus-loop-escape-launch.md`

- [ ] **Step 1:** Add 3-4 `##` headings over existing paragraphs (ko: `어떤 게임인가요`, `레벨과 부스터`, `지원 기기·언어와 광고`, `iOS 버전과 의견 보내기`; en equivalents), no sentence changes; add `updated: "2026-11-12"`.
- [ ] **Step 2: Build** → dist post has 4 `<h2` with ids in the article and a TOC; `dateModified` `2026-11-12`; sitemap `lastmod` for that post `2026-11-12`.
- [ ] **Step 3: Commit**

```bash
git add src/content/blog/ko/2026-10-31-bus-loop-escape-launch.md src/content/blog/en/2026-10-31-bus-loop-escape-launch.md
git commit -m "post: 출시 글에 소제목 추가"
```

### Final verification

- `node --test src/lib/*.test.ts` all pass; build `Complete!`; root `npm run check` passes; `git status --short` in both repos shows only the pre-existing untracked folders.
