---
title: "How a One-Person Company Tracks Five Apps at Once"
date: "2026-11-06"
category: making
excerpt: "Five projects on Claude Code, five growing handoff notes. We moved task state to JSON, tied checks to file hashes, and built one dashboard."
tags: ["task management", "dashboard", "devlog"]
cover: ../../../assets/blog/2026-11-06-work-system-dashboard/cover.jpg
coverAlt: "The blue water-wave mascot pinning colorful cards onto a large board, with three glowing progress screens beside it"
works: []
---

## Overview

WaveWorks is a one-person company that makes mobile games and apps, and right now we are building five projects at once with Claude Code, an AI coding tool. Out of the box, Claude Code does not remember earlier conversations when you open a new one (a session), so we needed rules for a way of working where a document carries over how far we got and what comes next. There are plenty of schedule-management skills and plugins for keeping the development stage up to date, but none of them felt like a fit for us. So we tuned the rules ourselves from a vanilla setup and ran things our own way, combining ROADMAP.md and STATE.md. The trouble was that those documents grew with every session, so the token cost of reading them kept climbing, and since we were running several projects across several sessions at the same time, once things got tangled we either could not find where we had left off or burned a lot of tokens finding it. So we overhauled the whole system: we moved what we had been managing in markdown into JSON, changed it to record completion and verification separately, and built a dashboard so that when several projects are in flight we can see them all at a glance on one screen. We have not measured the efficiency yet, but it feels like a real improvement in many areas.

![Dashboard home. Each project card shows a progress percentage, the current stage, and one line for the task in progress](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-home.jpg)

On this home screen every card shows the overall progress, the current stage, and the task in progress, so we can see how far each of the five projects has come without opening the repositories one by one.

## When roadmaps and handoff notes outgrew us

Each project kept two documents in its repository. The roadmap was a markdown file that listed tasks in a table and switched each one to a checkmark when it was done, and the handoff note described the current situation and the next steps so the following session could pick up the work. A session updated both files whenever it finished a task, and a new session started by reading both.

As sessions piled up, the handoff notes became hard to manage. We had set a 12KB limit, but the notes for two of our games reached 46KB and 49KB because the task list, the reasons behind decisions, verification results, and the change history all accumulated in one file. Every session read the whole file at startup, which made starting expensive, and finding the most recent line became hard as well.

The roadmap tables had the same problem. The old roadmap for Oh My Baby, an app for logging a baby's feeding and sleep with one hand, ran to 224 lines with 53 done marks and 44 open ones, and one row held a cell of more than 1,700 characters. That cell listed 21 separate times we had checked back while waiting for a pre-launch report from the Play Console, so a document we opened to see task status had turned into a log we had to read through.

The bigger problem was what a checkmark did not say. A check only meant that the task was finished at that moment, so whether the code had changed since, or whether a device test had actually been run or deliberately skipped, could only be found by reading the text inside the cell. Once there were five projects, seeing where things stood meant switching between the roadmaps and handoff notes of five repositories, and because the document types and locations differed from project to project, the same kind of information lived in a different place each time.

## Moving the task list into JSON files

Each project now keeps its task list and state in three JSON files: project information, the task list, and a change log. The human-readable roadmap is generated from this JSON, and its first line carries the hash of the source JSON, so if someone edits the roadmap directly, or the source changes and the roadmap is not regenerated, the check command catches it. The handoff note keeps only the narrative and points to tasks by ID.

Tasks are organized in five layers. There are nine stages from planning to operations, each stage holds groups of work (epics), each epic holds tasks, and each task can hold subtasks and checklist items. Progress is calculated only from the third layer, the task count, which we chose so that a session can add as many subtasks as it needs without moving the progress number.

Instead of reading the whole file every time, a session asks a summary command for the current release progress, the tasks in progress, the blocked tasks, and the check results in one go. State changes go through commands, and every changed field leaves one line in the change log; after we migrated 176 tasks for Oh My Baby, the log collected 167 entries in two days.

## Telling when a verification has gone stale

The new system treats completion and verification as two different things. Completion means the work was done; verification means it was checked and that check is still valid. When we record a verification, we store the sha256 hash of the file or document section it was based on. A hash reduces the content of a file to a short value that changes if even one character changes, so when we recompute the hash later and it differs, the done mark stays as it is and a separate stale marker appears on the verification.

Skipping a check also has a recorded form. We leave a waiver that says who waived what scope, when, and why, and the dashboard shows it as "passed (N waived)" instead of counting it as a pass. What used to be a note like "device test skipped" written inside a roadmap cell is now a state value we can filter on. In the current Oh My Baby release, among the tasks that have verification records, 5 are valid passes and 61 are waivers, and that imbalance is now visible as a number.

## Giving every epic a definition of done

When a new project starts, it receives a template of epics for each stage. The first template had 121 epics, of which only 47 had child tasks, so the screen filled up with empty epics, and none of them said what "done" meant, so we rebuilt the template. It now has 15 shared epics plus type-specific ones for apps, games, and web, and each epic carries a short done checklist that says what has to exist where and who confirms it. Empty epics are folded and left out of progress, and operational work that never ends after launch, such as handling inquiries or watching metrics, lives in standing epics of its own.

![Task detail panel. One epic's state, two lines of done conditions, the state of six child tasks, and linked documents are visible](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-task-panel.jpg)

The panel above is the "Records, sharing, notifications, and privacy policy" epic from Oh My Baby. Its state reads "in progress (aggregated)", which means we do not set the epic's state by hand; it is computed from its six child tasks. With the done conditions, the children's states, and the linked documents on one screen, a session can tell right away what remains before the epic can close.

## What we check on the dashboard

The dashboard is a local web page that reads the JSON of seven repositories: the five projects, the shared packages, and the company website. It does not compute its own numbers but calls the same code the summary command uses, and we decided that any difference between a card and the command output is itself a bug.

![Overview tab. Release 1.0 at 83% overall, progress for each of the nine stages, six epics in progress, and two waiting tasks](../../../assets/blog/2026-11-06-work-system-dashboard/dashboard-overview.jpg)

Opening a project shows per-stage progress on the overview tab. For Oh My Baby, more remains in the verification and release stage than in implementation, and two waiting tasks are listed: a library version upgrade and native-speaker review of the Japanese and Chinese text. The tasks tab filters the stage tree down to what is left, what is waiting, or what is in progress, and the state of a leaf task can be changed right on the screen, which writes a line to the change log. The inbox on the home screen gathers tasks that are waiting for an approval or an outside reply, so we can see which decisions are pending without opening a repository.

## What is still unresolved

We have not measured efficiency. The system is two days old, and we have not yet measured how much handoff cost or session startup time has dropped. The check command reports no errors for any of the five projects, but it reports many warnings: 34 for Screw Punch 3D, a puzzle about unscrewing 3D models, and 33 for CheepDoku, a logic puzzle where you place one chick per row. All of them say a task is done but has no verification record, which happened because we migrated the old roadmap checkmarks without being able to restore the evidence behind them. Bus Loop Escape, the game we have already released, shows 46% on its card because its pre-launch task history has not been migrated yet, so the figure is lower than reality.

What has clearly changed is that we see the progress of all five projects on one screen instead of in five repositories, and we see as a number whether a finished task's check is still valid or was waived. How much faster sessions start is something we will know after a few weeks of operating records have accumulated.
