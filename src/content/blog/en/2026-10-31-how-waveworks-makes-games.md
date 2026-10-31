---
title: "How WaveWorks makes games"
date: "2026-10-31"
category: culture
excerpt: "We regenerated all 300 levels four times in one day on our first game. Here's what we changed after that, and why we're moving to Unity."
tags: ["How we work", "AI", "Unity", "Level design"]
cover: ../../../assets/blog/2026-10-31-how-waveworks-makes-games/cover.jpg
coverAlt: "Two small robots on a studio desk stacking blocks into game screens"
works: ["bus-jam"]
---

On October 4, 2026, we regenerated all 300 levels four times in a single day. It was day two of building our first game, Bus Loop Escape. Of the 313 commits we made over 9 days, that day is the one we stayed stuck on longest.

WaveWorks is a one-person game studio founded in October 2025. The founder decides what to make, Claude Code writes the code, and Codex draws the art. What follows covers the calls we got wrong on the first game and the order we changed afterward.

## The day we rebuilt the levels four times

The level generator ran on the first night. It's a program that decides how many buses to place, in which colors and where, so changing a rule meant we could rebuild all 300 levels at once. That was the trap. Because rebuilding was easy, we did it after every change.

| Time | What changed | Levels rebuilt |
|---|---|---|
| 10-04 03:04 | Generator v2: bus-count driven, reverse-escape placement | 1–300 |
| 10-04 12:00 | Passenger queue rule v3, color curve | 1–300 |
| 10-04 18:15 | Queue fixed at 150 slots, more buses and colors from level 11 | 11–150 |
| 10-04 18:28 | Queue set to 152 slots | 11–300 |

Every time, we rebuilt all 300 before playing the new rule ourselves. And the levels were still easy. Two days later, around midnight on October 6, we ran a simple bot that only moves whatever bus is free. It cleared 294 of 300 levels. Adding hidden buses and containers didn't create any tense moments either. Difficulty only started to land after we switched to generator v5 at 4 a.m.

![Tapping out the buses that are free to move in Bus Loop Escape](/works/bus-jam/shots/en-1.jpg)

Now we don't mass-produce levels or art until one full round is built and the founder has played it. We call this step the vertical slice. We measure difficulty with a bot first and change the generator only once we have the numbers.

## Writing the release list on day 7

The game rules worked within four days. Close to half the commits, about 145, went into art and effects. On October 6 alone we swapped placeholder art for AI images one piece at a time: booster icons, the main menu, the shop, the loading screen, the backgrounds.

Release prep started last. Store account approval and translations were things we could have known about on day one, yet the release to-do list only got written on day 7, October 9. Japanese and Chinese text and store screenshots went in on October 19, the same day the game went live on Google Play.

Now the release sheet comes before the game plan. On day one we write down the countries and languages, store accounts, app name, revenue model and review materials, and we send off the slow account applications that day. The order after that:

1. Release sheet
2. Plan: who the game is for, in one paragraph
3. Analysis: compare similar games and features
4. Design: art direction and screens in the first week
5. Vertical slice: one full round in the chosen art
6. Build and release: add content, test on real phones
7. Operate: look at the numbers 2, 4 and 8 weeks after launch and decide what to invest in next

## If we did it again, Unity from the start

We built Bus Loop Escape with web tech. It got us started fast, but keeping it smooth on budget phones and fitting every screen size took more and more work. On October 26, 2026, we decided to move our games to Unity.

If we were making the first game again, we'd start in Unity. New games now do, and we're moving the existing ones over one by one.

We don't rewrite ads, payments, saving and analytics for each game. We split that code out of the first game into shared packages, and the next game only swaps in its own values, like the app ID and ad units.

## Rules every game follows

- Languages: we ship in Korean, English, Japanese, and Simplified and Traditional Chinese first, then add German, French, Spanish, Brazilian Portuguese and Indonesian for ten in total. App names, store descriptions and screenshots get a version in each language too.
- Screens: we don't ship screens made of flat single-color surfaces and plain shapes. Shadows, highlights and thickness give them depth.
- Testing: we check three times, in the dev view, on an emulator and on a real phone. A game ships only when it holds up on both a high-end and a budget device.

## What's next

We've released one game on Google Play, and it's too early to talk about revenue or player numbers. Right now we're preparing the iOS version of Bus Loop Escape and its move to Unity. The next game started with a release sheet and is going through the vertical slice, and we'll keep writing up the calls we get wrong here.
