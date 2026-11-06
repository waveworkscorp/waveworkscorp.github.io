---
title: "Building Our Task System: JSON Is the Source, Views Are Generated"
date: "2026-11-06"
category: making
excerpt: "We put every app's progress in tasks.json and generate the views from it. In two days we migrated five apps and built a dashboard."
tags: ["task management", "dashboard", "dev log", "retrospective"]
cover: ../../../assets/blog/2026-11-06-work-system-dashboard/cover.jpg
coverAlt: "A small robot pins cards from a yellow file box onto a large board of colored blocks"
works: []
---

The handoff documents of two of our apps had grown to 46KB and 49KB. The limit was 12KB. Every new session started by reading one of them from the top to work out where we had stopped, and because the same facts lived in both the handoff document and the roadmap, we often had to check which one was right.

Between the morning of November 5 and the afternoon of November 6, 295 commits landed in the root repository. In that time we built a system that keeps task state in a JSON file, then added a dashboard that shows it on one screen. Several of our calls turned out to be wrong.

## What one document was doing

The complaints came down to four. The handoff document was too big and held everything. Document types and locations differed from app to app. Finding the right document took too long. Stale files and duplicate records kept piling up. One handoff document was carrying handoffs, task lists, decisions, verification and history all at once.

The source of truth was also split in two. Only Oh My Baby converted its roadmap document into JSON, one way, and fed that to the dashboard, but the converted copy was not authoritative. Closing that gap made the design grow.

The goal was to see each project's current goal, progress, blockers and pending decisions on one screen.

## Where should the source live?

On November 5 our CEO chose option A out of three.

| Option | Source of truth | Why not |
|---|---|---|
| A (chosen) | `tasks.json`; the handoff document holds prose only, the roadmap is a generated view | — |
| B | Generate both the handoff document and the roadmap | The handoff rules and the wiki update procedure would all need rewriting |
| C | Keep Markdown as the source and derive JSON with parsers | Needs 4 parsers, IDs assigned by position shift whenever a document is edited, and writing means converting back to Markdown |

Choosing A came with one firm rule: a generated file never overwrites prose a person wrote. Prose stays in the handoff document, and numbers and status live in JSON.

## Renaming things

At first we called the levels depth 1 through depth 5. On November 5 the CEO renamed them after common industry usage such as Jira's Epic, Task and Subtask: Stage, Epic, Task, Subtask and Checklist item. The field names in the code stayed as they were.

Stages run from S1 to S9, and their code, order and meaning are fixed for every kind of app. A stage tells you where a piece of work sits; it is not a gate you pass in sequence. What differs between app types is expressed only through epic templates, display names and a "not applicable" marker. Work that repeats, such as a Unity port or a 1.1 release, goes on a release axis rather than becoming a stage. Operations that never finish after launch collect in an always-on S8 epic and we leave them out of the progress figure.

The first template showed its problem. Of 121 template epics, only 47 had child tasks, so the screen filled with empty epics. No epic said where "done" begins, and when a template changed there was no way to carry existing apps over. On November 6 we wrote template v2. Instead of adding a new schema field, we put the completion condition in the existing `done` field. Empty epics are collapsed by default and excluded from progress.

For moving existing apps to v2, the CEO picked option B. Rather than converting old epics in place (option A), we lay down new epics with new IDs, move the child tasks across, delete the old epics and record the old IDs under `legacy`. Epics that split or merge follow the same rule, and running it twice gives the same result. A future v3 can use the same command.

## Write rules and checks

A request to change a status looks like this.

```json
{
  "taskId": "BL-027",
  "set": { "status": "done" },
  "expect": { "status": "doing" },
  "baseHash": "…"
}
```

The server takes a lock and rereads the file. If `baseHash` has changed but `expect` still matches the latest value, the change is applied. Otherwise the whole request is rejected and the latest value is returned. Writes go to a temporary file that is then renamed, and every changed field adds one line to `changes.jsonl`. Locks expire after 60 seconds, and only three fields are writable: `status`, `block` and `verification`.

`work check` inspects the files with more than 36 rules, including duplicate IDs, dependency cycles, a parent marked done while its children are not, and a done task without valid verification. Editing the generated roadmap by hand returns exit code 1, and in a Claude session a hook blocks the edit outright.

Something still slipped through. Saving a status from the dashboard left the generated view stale, and one app raised a `view-stale` error. On the morning of the 6th we made it regenerate the view right after every save.

## Moving five apps

We tried Oh My Baby first. We checked that all 132 old roadmap items mapped to new tasks and that the 29 items marked exempt were still there. `work check` reported 0 errors and 47 warnings.

Three apps that kept their tasks in tables were rehearsed on copies first. They became 83, 78 and 30 tasks, with 0 errors each. We ran both rollback paths, before and after the commit, and confirmed the original file's sha256 matched. A review comment led us to add one more hash check before the original is deleted.

The real conversions produced 104, 99 and 34 tasks. Right after conversion, progress read higher than reality. The remaining plans had not been entered yet, so only finished work showed. Two of the apps were fixed by entering that plan.

Warnings remained too. We reduced 115 `work check` warnings across four apps to 108, and linked every remaining one to a per-app verification task. Most are items that need a real device.

## The dashboard and its editing

The first version was read-only. The server is a single `node:http` file, and we isolated Vite and React inside `work/dashboard` so the root `package.json` stayed untouched.

We built a status editing screen once and removed it on the CEO's decision. During the redesign on the 6th we reopened it for the `status` of leaf tasks only. Epic and stage progress is computed from children, so it cannot be edited. Writes go through the same module the CLI uses. A server with its own write code would mean two sets of lock and conflict rules.

Document editing sends the sha256 of the version you loaded. On save, a hash that differs from the current one is rejected and the latest text is loaded again. Claude sessions do not use the lock, so this hash check is the only defence. A different Origin gets 403, a `text/plain` request gets 415, and saving again with a stale hash gets 409.

The redesign started with the home card. Three bars, the full epic list and three chips on one card could not answer "how far along are we and what is happening now". We compared three mockups and picked option C: one large percentage for the whole project and a single row of stage chips. From the other two we kept only the theme and the density. Both light and dark themes are built.

The dashboard also has a screen for this site. It shows our works, the blog, sync status and visit statistics. For statistics we chose Cloudflare Web Analytics. It uses no cookies or browser storage and attaches to GitHub Pages with one line of script.

We also caused an accident while checking. Looking at the screen in a browser, we clicked a status button on a real project and changed one Oh My Baby task (`BL-027`). We restored that file to `HEAD`, and from then on limited checks to what does not touch the status buttons. A hidden tab holding a live connection open used up the browser's connection limit as well, and that is fixed too.

## What is left

When the core of the system was finished, there were 282 work tests and 125 dashboard tests. On the afternoon of the 6th there are 604 and 615. The counting scope shifted between those two points, so treat the numbers as rough.

Some screens have not been checked by eye. Those are focus movement between the drawer and the task panel below 900px, the bottom bar when the window height is reduced, and focus overlap when the palette opens while closing the drawer. We have not seen the section editor on a real large document either. Saving would change an app repository. The server must be restarted for code changes to take effect, and the root `npm run check` does not include `work/`, so it has to be run separately. We also cannot yet collapse an empty epic again.

Next up are the screens we have not seen. After the status-button accident, we will look at them in a way that leaves real project data alone.
