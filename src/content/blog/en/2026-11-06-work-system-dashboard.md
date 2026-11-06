---
title: "From a Markdown Roadmap to a JSON Source of Truth and a Dashboard"
date: "2026-11-06"
category: making
excerpt: "How we replaced a 40KB Markdown roadmap with a tasks.json source of truth and a dashboard, with the numbers from migrating five apps."
tags: ["task management", "dashboard", "dev log", "retrospective"]
cover: ../../../assets/blog/2026-11-06-work-system-dashboard/cover.jpg
coverAlt: "A small robot pins cards from a yellow file box onto a large board of colored blocks"
works: []
---

WaveWorks is a company that makes mobile games and apps. We are building five at the same time. Bus Loop Escape, a puzzle about pulling buses out of a jammed parking lot, is out on Google Play. The rest are Oh My Baby, a baby log you can use with one hand; Screw Punch 3D, where you spin a 3D model and pull its screws; Yokai Hunters, a roguelike defense game played with five-element cards; and CheepDoku, a logic puzzle where you place one chick per row. We write the code together with Claude Code, an AI coding tool.

Each app now has between 46 and 176 registered tasks, and the way we wrote down "where are we and what comes next" stopped scaling. On November 5 and 6 we replaced it. The roadmap we used to keep by hand in Markdown moved into a JSON file, which is now the authoritative original for task state. We call it the source of truth in this post. We also built a dashboard that reads that file.

## The old system

Two documents did most of the work. `docs/STATE.md` in each app folder is the handoff document the next working session reads, and `docs/ROADMAP.md` is the list of what remains. An AI session does not remember the previous conversation. So at the end of a session we write the current state and the next steps into STATE.md, and the next session starts by reading it.

Take Oh My Baby. Just before the switch, STATE.md was 50 lines and 12,383 bytes, and ROADMAP.md was 224 lines and 39,731 bytes. The roadmap had one table per stage, and each row was one task.

```markdown
| 번호 | 할 일 | 담당 | 선행 | 완료 기준 | 근거 |
| R1.1 | [x] 법률 원문 조사: L1~L15, B1·B2를 원문으로 조사해 항목별 판단 초안 작성 | Claude | - | `plan/legal-findings.md`에 항목마다 출처·판단·방침 반영 여부·사용자 결정 칸 | SHARE-01 8.5.1, BACKUP-01 게시 관문 |
| R1.3 | [ ] WHO 성장 도표 허가 신청·식약처 질의 제출. v1.1 관문이지만 회신 기간을 몰라 지금 냄 | 사용자 | - | 접수 번호를 `plan/GAP-01-gates.md`에 적음 | GAP-01 |
| R10.1 | [ ] 성장 백분위 | Claude | R1.3 WHO 허가 | 기획서 관문 충족 … |
```

(The columns are number, task, owner, prerequisite, done criteria and evidence. R1.1 is a legal-source review, R1.3 a submission to the WHO and Korea's drug regulator, and R10.1 a growth-percentile feature that waits for R1.3.)

The rules were written at the top of the file. The number `R<stage>.<sequence>` only gives order, and the status is `[ ]` open, `[~]` partial or `[x]` done. When every row of a stage is `[x]`, that stage collapses into a one-line summary, and the document stays under 400 lines. Evidence for finished work (console values, dates checked) lived in other files such as `plan/release-checklist.md`.

The other apps were messier. Three kept a table-style progress sheet in `plan/progress.md`, and Bus Loop Escape used yet another format that we later moved by hand.

## Where it broke

- **The handoff document kept growing.** We set a 12KB limit for handoff documents, and two apps' STATE.md files grew to around 50KB. Every session has to read the whole thing first.
- **One task had two numbers.** The roadmap number `R1.3` only gives order, while commit messages and record files use task IDs such as `GAP-01`. A person linked the two in the evidence column.
- **`[x]` carried no evidence.** A checkbox records that something finished. What was checked sits in prose in the evidence column and in other documents, and the checkbox cannot tell you whether the code changed after the check.
- **Prerequisites were sentences.** Row R10.1 above has `R1.3 WHO 허가` in its prerequisite column. A person can read that; a program cannot compute "this is blocked".
- **Every format needed its own parser.** Only Oh My Baby had a one-way conversion of the roadmap to JSON for the dashboard, and that copy was not authoritative. Reading the table-style sheets too would have taken four parsers (programs that read a document and turn it into data), and IDs numbered by position shift every time a document is edited.

The goal was to see each project's current goal, progress, blockers and pending decisions on one screen.

## Where should the source live?

On November 5 we chose option A of three.

| Option | Source of truth | Why not |
|---|---|---|
| A (chosen) | `tasks.json`; the handoff document holds prose only, the roadmap is a generated view | — |
| B | Generate both the handoff document and the roadmap | We would have to rewrite the handoff rules and the wiki update procedure |
| C | Keep Markdown as the source and derive JSON with parsers | Needs 4 parsers, IDs numbered by position shift whenever a document is edited, and writing means converting back to Markdown |

`tasks.json` is the source of truth, and the human-readable `ROADMAP.md` is a read-only document that a program generates from it (a generated view). Prose lives in STATE.md and design documents; numbers and status live in JSON. A generated file never overwrites prose a person wrote.

### The task hierarchy

There are five levels. We first called them depth 1 through depth 5, then renamed them to match common usage such as Jira's Epic, Task and Subtask. The field names in code (`stage`, `parent`) stayed as they were.

| Level | What it is | Progress |
|---|---|---|
| Stage | `S1`–`S9`; code, order and meaning are fixed for every app type | sum of children |
| Epic | A large chunk of work inside a stage, laid down by a template | sum of children |
| Task | One piece of work that gets built and verified; the weighting unit | weighting unit |
| Subtask | Detail that appears during execution | no effect |
| Checklist item | The lowest-level check | no effect |

The nine stages are goal and direction, research and feasibility, product planning, design and execution plan, build, integration testing and launch prep, release, operations, marketing and growth, and retrospective. They say where a piece of work sits, and we do not treat them as gates to pass in order. What differs between app types is expressed only through epic templates, display names and a "not applicable" (`na`) marker. Work that repeats, such as a 1.1 update or a Unity port, is tied to a release (a release unit such as 1.0 or 1.1). Operations that never finish after launch collect in an always-on epic under S8 and we leave them out of the progress figure.

R1.3 above became this task after conversion. The old number stays in `legacy`.

```json
{
  "id": "BL-029",
  "title": "WHO 성장 도표 허가 신청·식약처 질의 제출. v1.1 관문이지만 회신 기간을 몰라 지금 냄",
  "stage": 3,
  "parent": "BL-170",
  "release": "1.0",
  "status": "todo",
  "owner": "user",
  "legacy": [
    { "id": "R1.3", "kind": "roadmap", "source": "docs/legacy/ROADMAP-2026-11-05.md", "line": 37 },
    { "id": "GAP-01", "kind": "work-id", "source": "docs/legacy/ROADMAP-2026-11-05.md", "line": 37 }
  ],
  "done": [{ "text": "접수 번호를 `plan/GAP-01-gates.md`에 적음" }]
}
```

Prerequisites go in `dependsOn` as task IDs (59 of Oh My Baby's 176 tasks use it). The sentence "R1.3 WHO 허가" that row R10.1 above carries in its prerequisite column is now an ID, so `work check` blocks cycles with `dependency-cycle`. Waits that a person has to resolve, such as an outside reply, go in the `block` field (for example `kind: external`), and those tasks collect under `blocked` in `brief`.

### What we store and what we compute

We split completion and verification into separate layers.

| Layer | Value | Stored |
|---|---|---|
| Task completion | `status: done`; a past fact, kept even if verification goes stale | stored |
| Verification validity | `current` / `stale` / `unknown` / `n/a` | derived |
| Gate | whether it passes right now | derived |
| Progress | based on completed tasks, independent of verification state | derived |

Progress uses the task (level 3) as the weighting unit and divides weight evenly among children. `cancel` and `na` leave the denominator, and so do skeleton items whose children are not yet defined (`plan: tbd`). That is why we publish progress and plan refinement (defined tasks / total) as two separate figures.

A task belongs to exactly one release. If a new release reuses a result as is, it references it with `inherits`; if requirements change, a new task is linked with `supersedes`; and if verification from an earlier release has gone stale, a new verification task connects through `reverifies`. A finished release is frozen into `archive/*.json` and its sha256 is registered in `project.json`. If the file changes, the check raises `archive-modified`.

## Write rules and verification fingerprints

A request to change a task's status looks like this.

```json
{
  "taskId": "BL-029",
  "set": { "status": "doing" },
  "expect": { "status": "todo" },
  "baseHash": "…"
}
```

The server takes a file lock (so only one writer goes at a time) and **rereads the latest file.** A changed `baseHash` (the hash of the file the request read) alone does not cause a rejection. For each field in `set`, it checks that `expect` equals the latest value. If every field matches, the patch applies even when other fields changed. If any field differs, the whole request is rejected and the latest value is returned.

- Accepted: A tries to write `status` from `doing` to `done` while B changes only `block` on the same task. `baseHash` differs, but `expect.status` matches the latest value, so it applies.
- Rejected: B changes `status` to `hold` first. A's `expect.status = doing` no longer matches, so the request is rejected and the latest value `hold` comes back.

Writes go to a temporary file that is then renamed, and every changed field adds one line to `changes.jsonl` (165 lines for Oh My Baby). Locks expire after 60 seconds, and only three fields are writable: `status`, `block` and `verification`. There are six rejection reasons: `conflict`, `invalid-request`, `archived`, `invalid-file`, `locked` and `write-failed`. One person runs several sessions at once, so a claim on a task (4 hours) is advisory only and never blocks a write. If another session holds the claim, the result carries a warning.

### Verification is compared by fingerprint

When we record "checked", we store a fingerprint of what we checked it against. A fingerprint is the file content reduced to a hash (sha256), so changing a single character changes it.

| Input kind | Recorded value | How it is compared now |
|---|---|---|
| `path` | list of file paths, sha256 of the sorted `path\0file-sha256` lines | rehash the working-tree files; any deletion, addition or content change makes it stale |
| `doc` | `path#section title`, sha256 of the section text | extract the section again and compare; if the section disappears it is stale |
| `env` | environment name and value | string comparison with the value in `project.json` |

Only server code computes fingerprints, and any fingerprint a request sends is discarded. A `passed` with no declared inputs cannot be judged, so it stays `unknown`. A real record looks like this.

```json
{
  "state": "passed",
  "method": "S23 실기기 화면 조작(adb)",
  "note": "2026-11-05 22:17~22:26 1.0(7): 수면 알림 [수면 끝내기] 탭 시 앱이 열려 수면 종료+수정 시트, 알림 사라짐 …",
  "inputs": [{
    "kind": "path",
    "refs": [
      "android/app/src/main/java/com/waveworks/babylog/RunningNotifications.kt",
      "android/app/src/main/java/com/waveworks/babylog/RunningDismiss.kt"
    ]
  }]
}
```

(The method is a hands-on check on a real Android device; the note records the date, the build, and what happened when the notification buttons were tapped.) If either file changes after the build we checked on a real device, this verification becomes `stale`. Before declaring inputs we first confirm with `git diff <checked build commit> HEAD -- <path>` that the files have not changed since that build, and if they have, we declare no inputs.

`work check` validates the files with more than 30 rules: duplicate IDs (`duplicate-id`), dependency cycles (`dependency-cycle`), a parent marked done while its children are not (`parent-done-open-children`), a done task without valid verification (`done-without-valid-verification`), and mismatched releases between parent and child (`release-mismatch`). Editing a generated view by hand returns exit code 1. We also set hooks in the working environment. Editing generated views such as `ROADMAP.md`, or frozen originals, is blocked the moment it is attempted, and editing `tasks.json` directly raises a warning.

## Migration

We moved **Oh My Baby** first. A conversion rule turned old items into tasks and kept the old numbers in `legacy`. We checked that all 132 old roadmap items mapped to new tasks and that the 29 items marked exempt were still there, and `work check` reported 0 errors and 47 warnings. The original was frozen as `docs/legacy/ROADMAP-2026-11-05.md` and its sha256 recorded in `project.json`.

The **three apps with table-style progress sheets** were rehearsed on copies first. They became 83, 78 and 30 tasks, with 0 errors each. We ran both rollback paths, before and after the commit, and confirmed the original file's sha256 matched. A review comment led us to add one more hash check before the original is deleted. The real conversions produced 104, 99 and 34 tasks. Right after conversion, one app's progress read higher than reality because its remaining plan had not been entered yet, so only finished work showed. Entering that plan fixed it.

We changed the **epic template** once. Version 1 had 121 template epics, only 47 of which had child tasks, so the screen filled with empty epics. No epic said where "done" begins, and when a template changed there was no way to carry existing apps over. Version 2 puts the completion condition in the existing `done` field instead of a new schema field. Empty epics are collapsed by default and excluded from progress. For existing apps, rather than converting old epics in place, we lay down new epics with new IDs, move the child tasks across, delete the old epics and record the old IDs under `legacy`. Epics that split or merge follow the same rule, running it twice gives the same result, and a future version 3 can use the same command. We moved five apps with one command and 19 `check:apps` runs passed.

## The dashboard

The server is a single `node:http` file, and we kept Vite and React inside the `work/dashboard` folder so the root `package.json` stays untouched. The server watches the task files and refreshes the screen when they change. If a file fails validation it keeps the last good screen and shows a yellow banner at the top. We met that banner while capturing screenshots for this post. The server that was already running had loaded an old schema and showed only `should NOT have additional properties`. We started a new server on another port and that fixed it.

![Dashboard home screen: each project card shows overall progress, nine stage chips and one line for the task in progress](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-home.jpg)

Home has one card per project. The big number is overall progress, and in the nine stage chips below it the current stage is drawn solid and any parallel stage is drawn faded. The last line is the task in progress. The screenshot is from the afternoon of November 6, so progress for unreleased works is the value at that time. Our first card carried three bars, the full epic list and three chips, and it could not answer "how far along are we and what are we doing now". We compared three mockups, picked the one with a large overall percentage and a single row of stage chips, and took only the theme and density from the other two.

![Oh My Baby overview: per-stage progress bars, 6 tasks in progress and 2 external waits](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-overview.jpg)

Opening a project shows the overview tab with per-stage progress (`S1`–`S9`), tasks in progress, tasks that are waiting, and changes that are not yet committed. Both waiting items are external waits. One is waiting for native-speaker reviews of the Japanese and Chinese text, and the other is a Firebase version upgrade we postponed until after launch.

![Oh My Baby tasks tab: a collapsible task tree grouped by stage, with status badges](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-tasks.jpg)

The tasks tab unfolds as a tree of stages, epics and tasks. Epics show a status computed from their children ("Done (rolled up)"), and the "Done before migration" tasks we created during conversion are labeled separately. The number on the right is how many documents are linked to the task.

![Task panel showing 2 completion conditions, 6 child tasks and linked documents](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-task-panel.jpg)

Selecting a task opens a panel on the right. Completion conditions, child tasks and linked design documents sit in one place, with previous and next buttons for moving between tasks.

We opened editing only as far as needed. Only leaf tasks (those without children) can change status, and epic and stage progress cannot be edited because it is computed from children. Writes go through the same module the CLI uses. If the server had its own write code, we would have two sets of lock and conflict rules. A document edit sends the sha256 of the version you loaded, and a save whose hash differs from the current one is rejected and the latest text is loaded again. AI sessions do not use the lock, so that hash check is the only defense. A different Origin gets 403, a `text/plain` request gets 415, and saving again with a stale hash gets 409. We also built section-level editing so documents over 256KB can still be changed.

We caused an accident while checking. Looking at the screen in a browser, we clicked a status button on a real project and changed one Oh My Baby task (`BL-027`). We restored that file to `HEAD`, and from then on limited checks to what does not touch the status buttons. A hidden tab holding a live connection open used up the browser's connection limit as well, and we fixed that. There is also a screen for this site (waveworkscorp.github.io). It shows our works, the blog, sync status and visit statistics, and it reads the statistics from Cloudflare Web Analytics, which uses no cookies or browser storage.

## Results

These are the `work check` results for the five apps on the afternoon of November 6.

| App | Tasks | Errors | Warnings |
|---|---|---|---|
| Bus Loop Escape | 67 | 0 | 0 |
| Oh My Baby | 176 | 0 | 15 |
| Screw Punch 3D | 113 | 0 | 34 |
| CheepDoku | 108 | 0 | 33 |
| Yokai Hunters | 46 | 0 | 3 |
| Total | 510 | 0 | 85 |

Most warnings mean "marked done, but the verification record is missing or stale". Of Oh My Baby's 15, 14 are `done-without-valid-verification`. We cut the 115 warnings across four apps to 108 and linked every remaining one to a per-app verification task, and the count is 85 now. Most are items that need a real device.

The hand-written ROADMAP.md (39,731 bytes) is now a generated view (230 lines, 29,097 bytes). The automated tests number 615 for the dashboard and 604 for the `work` tooling (from the handoff record of November 6).

Some things are not done.

- We have not shrunk the handoff documents. Two apps' STATE.md files are still 50,093 and 49,733 bytes.
- We have not checked some dashboard screens by eye: focus movement between the drawer and the task panel below 900px, the bottom bar when the window height is reduced, and focus overlap when the command palette opens while closing the drawer.
- The server must be restarted for code changes to take effect.
- The root `npm run check` does not include `work/`, so it has to be run separately.
- There is no way to collapse an empty epic again.

## How we work with it now

A working session goes like this.

```bash
# At session start: progress for the current release and the tasks in progress, ready and blocked, as JSON
node work/bin/work.ts brief --dir docs/work

# When work comes up that was not planned, register it as we start
node work/bin/work.ts add --dir docs/work --parent S5 --title "알림 버튼 재확인" --status doing

# When it is done, change the status, sending the value we read as expect
node work/bin/work.ts set <task ID> --dir docs/work --set '{"status":"done"}' --expect '{"status":"doing"}'

# Before committing, regenerate the view and run the checks
node work/bin/work.ts render --dir docs/work
node work/bin/work.ts check --dir docs/work
```

`brief` returns keys such as `doing`, `ready`, `blocked`, `standing`, `verification` and `check`. For Oh My Baby, `blocked` holds the two external waits and `standing` holds the post-launch always-on epics (inquiries and errors, acquisition and metrics, return visits and improvements).

- Requests that were not planned are registered with `work add` when we start them. We close them with `work set`, and any design document or verification report made for the task is linked to it with `work doc-add`.
- Before a commit we run `work render` and `work check` (0 errors) and commit `docs/work` and the generated view together.
- STATE.md holds only prose for the next session. It does not copy the task list and refers to tasks by ID.
- A new app starts with `work init`, which lays down the template epics for its type (app, game or web) across S1–S9.

Next are the screens we have not seen. After the status-button accident, we will look at them in a way that leaves real project data alone.
