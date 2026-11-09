---
title: "Can a Blog URL Teach Our Writing Skill a Style?"
date: "2026-11-09"
category: culture
excerpt: "Sentences in 48 posts from five Korean tech blogs average 50 characters; our last two posts averaged 68 and 63."
tags: ["Claude Code", "writing", "style", "engineering culture"]
cover: ../../../assets/blog/2026-11-09-blog-style-learning-mode/cover.jpg
coverAlt: "A water-drop mascot studying five differently colored notebooks with a magnifying glass while writing in a new notebook in the middle"
works: []
featured: false
draft: false
---

## Overview

WaveWorks is a one-person company that makes mobile games and apps, and we do both development and company blog writing with Claude Code, an AI coding tool. Each blog post is handled by a single Claude Code skill (an instruction file that spells out a work procedure), from research through proofreading. The posts it produced had long sentences and long paragraphs, though, and we wanted to hand it a reference blog by URL rather than one article at a time. So we added a style-learning mode that turns a blog URL into a style profile of how that blog structures and phrases its posts, and built a combined profile from five Korean tech blogs. This post is the first test of that profile; our two previous posts averaged 68 and 63 characters per sentence against the profile's 50.

## What it takes to learn from a URL

The skill originally lived inside the company site repository, so it could only be called from a site work session. We often write a blog post right after finishing work on the platform (the shared repository our apps build on), and switching to a site session every time was a nuisance. So we moved the skill into the platform plugin, where any session can call it.

While moving it, we also wanted the writing itself to improve. The skill already had check-rhythm.py, a script that measures sentence rhythm: average sentence length, the share of sentences under 40 characters, and runs of short, choppy sentences. On November 6 we read our own posts and found the sentences stopped and started abruptly, so we added a rule to join cause and effect in one sentence with connecting endings, and this script checked whether the rule held.

Numbers alone could not tell us what a good post looks like, though. If a blog wrote in the form we wanted, we wanted to give its URL and have the skill learn how that blog builds a post and which voice it uses. Before that, we measured the two technical posts we published on November 6 and 7: average sentence length was 68 and 63 characters, and only 22% and 19% of sentences were under 40 characters.

## What goes into a style profile

Given a blog URL in style-learning mode, the skill writes no post and produces only that blog's style profile. It first collects 8 to 15 recent posts, skipping announcements, job listings and event notices and preferring topics close to what WaveWorks writes about. It then runs check-rhythm.py over them to get average and median sentence length, the share under 40 characters, sentences per paragraph, the ratio of sentence endings (formal hamnida versus conversational haeyo, among others) and sentences per post.

With the numbers in hand, a subagent (an AI worker given one task separate from the main job) running Claude's Opus model reads the posts and records patterns under seven headings: opening, structure, sentences, evidence, qualitative signals, closing, and things avoided. Only patterns that recur in two or more posts are kept; anything found in a single post is dropped, and every heading cites at least two post titles as evidence. The result is saved under the blog's name in styles/, the folder that holds profiles.

Does collecting another company's posts raise a copyright problem? The profile copies no original sentences; patterns are written as descriptions, and evidence is recorded only as post titles and URLs. Example sentences are written fresh from WaveWorks facts, and the collected originals stay in a temporary working folder and are never committed to the repository.

When writing, we add `문체: <name>` (style: name) to the request. The writing instructions then include that profile's patterns and examples, and in the proofreading step the script compares the draft's numbers with the profile, flagging any gap over 25% as "large difference". The seven headings are checked one by one as well. We also fixed what a profile cannot change: the site's sentence ending (formal hamnida), its subject ("we"), its fact rules and its suitability for publication stay the same whichever profile is used, so that posts on the site do not drift between voices. Profile numbers are a target range, and even with a "large difference" flag, reading the draft aloud comes first.

Separately from profiles, we also reworked the step that looks up posts on the same topic before writing, to check their structure and content. Korean company tech posts are now searched first on velopers.kr, a site that aggregates Korean company tech blogs and offers semantic search; its results are rendered on the server, so a script can read them directly.

## Combining five blogs

The first profile was built from Toss Tech. Its RSS feed (a machine-readable address where a blog publishes its post list and bodies) carried full bodies, so we used 12 of the 20 most recent posts as they were.

Once one profile existed, we wanted to give several reference blogs at once. Now, given more than one URL, the skill builds a profile per blog and one more combined profile on top. Posts per blog are held to 8 to 10 so no single blog drives the numbers. For the combined patterns, the subagent receives only the per-blog profiles, no originals, and sorts patterns into common ones (found in two or more blogs) and blog-specific ones; where patterns conflict, both are recorded and the one that fits WaveWorks posts is chosen, with a one-line reason.

The five blogs are Toss Tech, Kakao Tech, the Woowa Brothers tech blog, Daangn Tech and the Banksalad blog, with 48 posts behind the numbers. Per-blog average sentence length was close together, at 46 to 56 characters. Endings were 57% formal and 34% conversational, and most of the conversational share came from Toss (79%) and Daangn (88%). The median number of sentences per post was 113, but per blog it ranged widely, from 61 to 228.

The flow found in all five was: the old approach and its problem, a first attempt, its limits, the new approach and why, results, then costs and what remains. All five also recorded alternatives considered and rejected with reasons, and kept costs and remaining limits separate from gains; four of the five openly stated that their first idea had been wrong.

Some patterns conflicted. Kakao and Daangn open with a greeting while Woowa Brothers does not, and we chose no greeting; between the conversational endings of Toss and Daangn and the formal endings of Kakao and Woowa Brothers, we chose formal. Subheadings follow Toss, one level and 4 to 8 of them, and instead of the four blogs that put code in every implementation post, we follow Toss and include at most one essential block. Closings split four ways, a list of questions (Toss), a summary and lessons (Kakao, Banksalad), a resolution (Woowa Brothers) and a hiring note (Daangn), and we settled on one or two sentences of lessons followed by what remains and the next step.

Measured against this combined profile, three of the four figures for our two earlier posts came out as "large difference".

| Metric | Combined profile (48 posts) | Nov 6 post | Nov 7 post | This post |
|---|---|---|---|---|
| Average sentence length | 50 chars | 68 chars | 63 chars | 53 chars |
| Median | 45 chars | 69 chars | 63 chars | 53 chars |
| Sentences under 40 chars | 40% | 22% | 19% | 27% |
| Sentences per paragraph | 2.4 | 3.2 | 2.9 | 2.3 |
| Formal endings | 57% | 100% | 100% | 98% |

## Patterns we did not carry over

Of 48 common patterns, we adopted 38 and marked 10 as not carried over because they clash with the WaveWorks site rules: numbered subheadings, two-level subheadings, subheadings phrased as conclusions, a "closing remarks" section, first-person singular, a whole-post summary paragraph, a resolution paragraph and hiring notes. We also dropped the thank-you note; in a one-person company there are no colleagues to thank.

The scope sentence in the opening needed fixing on the profile side too. All five blogs state what the post will cover with a sentence of the form "In this post we introduce...", and that is a sentence the WaveWorks site has decided not to use. The first blog profiles we built had it baked into their examples and rules, so we corrected all of them and gave that job to the "Overview" section at the top of every technical post.

## Where collection and measurement got stuck

Does a single blog URL yield the post bodies right away? Collection paths differed across all five blogs. Woowa Brothers and Daangn (on Medium) carry full bodies in RSS, so we took them as they were. Kakao Tech renders its pages with JavaScript, leaving no body in the page HTML, so we fetched bodies from the post API (an address through which programs exchange data, in JSON) that the site itself uses. For Banksalad we cut the body region out of each post page's HTML. The confirmed paths are now written down so we do not have to find them again.

Measurement had to be redone twice. Banksalad's first pass showed 28% of sentences in the "other" category, matching no ending type; the cause was page elements outside the body, such as share-button labels, related-post lists and date lines, and after cutting them out the figure fell to 12%. The ending classifier was also not counting sentences ending in "~죠" as conversational, so we fixed the rule and re-measured every profile. Toss's 79% conversational share is the corrected value.

## What remains

This is the first post written from the combined profile, and after proofreading the same script measured an average sentence of 53 characters and 2.3 sentences per paragraph, close to the combined profile. Sentences under 40 characters came to 27% against the profile's 40%, which the script flags as a large gap. We have not yet found a way to add more short sentences while keeping our rule of joining cause and effect in one sentence. Whether the posts read better is still unmeasured, and the first thing to check is whether the numbers hold across the next few posts.

The numbers shifted as soon as the measurement scope was off. Stray page elements pushed "other" endings to 28%, and one missing rule changed the conversational ratio, so we now check what was measured before using any profile figure. If you want to borrow the structure of another blog, decide first to keep only patterns and cited titles, with no original text.
