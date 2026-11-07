---
title: "Should Docs Only the AI Reads Stay in Korean?"
date: "2026-11-07"
category: culture
excerpt: "Three rule files went from 1,175 to 582 tokens in English, while three short design docs grew 2–18% after keyword lines and summaries."
tags: ["Claude Code", "documentation", "tokens", "engineering culture"]
works: []
featured: false
draft: false
---

## Overview

WaveWorks is a company that makes mobile games and apps, and we develop with Claude Code, an AI coding tool. Our rule files, design docs and handoff notes are read by Claude at the start of every session and never opened by a person, yet we had been writing all of them in Korean, which cost more tokens than the same content in English. So we made English the default for everything Claude reads, keeping Korean only for what people read. Three rule files dropped to about half their token count, but short design docs actually grew, so we narrowed the conversion scope again.

## Documents nobody opens

When we develop with Claude Code, Claude reads the global rule files and the project rules every time a session opens, and depending on the task it also reads design docs, plans and handoff notes. We almost never open those files ourselves; when we want to know what is in them, we ask Claude for a summary or receive an HTML report. All of them were written in Korean, and because several sessions across several projects read the same documents every time, any extra tokens Korean cost over English would pile up session after session.

We measured the difference first. Rewriting three global rule files in English brought their token count from 1,175 to 582, about 0.50 times the original. We counted with tiktoken's cl100k_base, which is not Claude's tokenizer, so we treat this as a proxy. Roughly 25.8K tokens load in every session, and if the Korean portion shrank at the same rate we estimated a saving of about 10K tokens, or 39%. That figure applies the ratio from three files to the whole set and is an estimate, not a measurement.

Our first calculation was wrong. The first report said we would save 77KB, measured in bytes, but Korean characters take 3 bytes each, so a byte count inflated the saving; after the actual rewrite, bytes fell only 1–3%. Since the cost is paid in tokens, we removed that number and corrected the report to token figures.

## From a path list to a default rule

At first we listed the paths that should be written in English and decided not to translate existing Korean documents in bulk, because of the one-time translation cost, the risk of breaking Korean search, and the risk of changing meaning in translation. But whenever a document was not on the list, which language to use was unclear, and hundreds of Korean documents in five apps sat outside the list.

So we reversed the rule: apart from text that people read, the default is English, and whether a document stays in Korean is decided by three questions.

- Does the user read, check or approve it? Console explanations, requested summaries, HTML reports and decision records fall here.
- Is Korean clearly better operationally? Phrases a hook checks, phrases that trigger a skill, and quotes of what the user said.
- Would English break something? Tables a program parses, headings the dashboard reads, strings quoted by code.

If any answer is yes, the document stays in Korean, and if only part of a file qualifies, only that part does. Exceptions live in one file, and each project can append its own.

## What breaks when you switch to English

The first thing to break was cross-references: other documents and skills cite sections by their Korean headings, so renaming a heading in English cuts every reference pointing at it. Before changing a heading we now search the whole repository for it, and new references are written as "English (Korean)" so both spellings are present.

Some Korean is read by code. A program parses the values "양쪽/한쪽" ("both / one side") straight out of a table, the new-app generator looks for Korean placeholders in templates and replaces them with the app name, and the dashboard reads status values from documents to display them. Translating these strings means the program can no longer find them, so we either change them together with the code or leave them alone.

Phrases that hooks check we excluded from translation entirely. A translation agent once rewrote a template placeholder in English and we had to restore the original, and since then hook-checked phrases and placeholders are kept out of the translation scope.

## Keeping Korean search working

Our concern was whether we could still find an English document with a Korean query, since we ask Claude our questions in Korean. We took four converted documents, wrote 18 Korean queries a user would plausibly type, and searched: 12 hit, 6 missed, and all 6 misses were the same concept spelled differently. The document said "절 단위 편집" (section-unit editing) while the query was "절 편집" (section editing). Task names, English terms and exact phrases written in a keyword line, on the other hand, always hit.

So we added a rule: every English document starts with a line of Korean keywords, with two or three spellings per concept. A second test on different documents with the same approach hit 12 of 16 queries, and the remaining 4 asked about terms the documents never contained, which no keyword line can fix. Because the dashboard needs to show documents in Korean, each document also carries a "Korean summary" section of up to ten lines, and that summary has the same content as the explanation we approved in the console.

## Translation as a skill, verification separately

We turned converting existing documents into a skill called english-convert so that Claude follows the same procedure every time. It first grades each document by its Korean ratio, size and whether other places cite it: frequently read, linked to open tasks, cited by code and needing a check, convert when next edited, exception, and already English. Then it proceeds in order: scope approval, backup, a per-document brief, translation, verification, one independent review per batch, and a before-and-after comparison.

The verification tool checks only whether numbers, IDs and paths went missing and whether Korean remains. A low Korean ratio does not mean the meaning survived, so meaning is the review step's job, and the review did catch real mistranslations: "every Monday 09:30" became monthly, "뒤 단계" (the stage with the smaller number) became "later stage" with the direction reversed, and "one character of the game name" was rendered as just "one character", dropping what it was a character of.

We also added a warning hook that fires when a Markdown file outside the exception list is written or edited with a high Korean ratio. It does not block anything and warns once per file per session.

## Short documents that got longer

Not every document shrank. Three sample design docs grew in estimated tokens once the keyword line and Korean summary were added.

| Design doc | Before | After | Change |
|---|---|---|---|
| Sample 1 | 747 | 884 | +18% |
| Sample 2 | 1,217 | 1,249 | +3% |
| Sample 3 | 1,358 | 1,390 | +2% |

These numbers come from a heuristic without a tokenizer, such as 1.2 tokens per Korean character. So we treat the 0.5x effect as confirmed only for long rule files that load every session, and documents that are no longer read, such as plans and design docs of finished work, are left unconverted or deferred.

## What we gained and what remains

The converted scope covers the global rules, output style and global instructions, 9 root documents, 40 skills, 9 new-app templates, 26 memory files, and the frequently read documents of five apps. Those counts describe the scale; the only measured effect is the three rule files at 0.50x on a proxy metric. We have not yet measured the actual per-session token saving after the full conversion, any change in the agent's task accuracy, or whether memory recall quality holds.

Limits remain. Some skills have not been invocation-tested, we have not run new-app generation end to end, and documents marked "convert when next edited" are still in Korean. There are also articles arguing that writing in one's native language does not lower agent accuracy; our criterion was tokens and the always-loaded volume, and the accuracy comparison is not yet measured.

Next, we will collect a week of warning-hook logs to adjust the threshold and test the skill invocations we skipped.
