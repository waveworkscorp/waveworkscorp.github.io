---
title: "Bus Loop Escape: a 9-day dev retrospective"
date: "2026-10-31"
category: culture
excerpt: "On our first game we rebuilt all 300 levels four times in one day and wrote the release list on day 7. Then we changed our working order."
tags: ["How we work", "AI", "Unity", "Level design"]
cover: ../../../assets/blog/2026-10-31-how-waveworks-makes-games/cover.jpg
coverAlt: "Two small robots on a studio desk stacking blocks into game screens"
works: ["bus-jam"]
---

Our first game, Bus Loop Escape, took 9 days and 313 commits. The part we redid most was the levels, and the part we touched last was release prep. Both are why our working order looks different now.

WaveWorks is a company where one founder decides what to make, and the code and art are built with Claude Code and Codex.

## Day one: the generator first

On October 3, as soon as the rules worked, we built a level generator, a program that decides how many buses go where and in which colors. The first version went in at 11:18 p.m. and produced 300 levels in one go.

It was convenient. Change one rule and all 300 came out fresh. The trouble was that the convenience let us skip actually playing them.

## The same 300, four times

On October 4 we changed the rules four times.

| Time | What changed | Levels rebuilt |
|---|---|---|
| 03:04 | Generator v2: bus-count driven, reverse-escape placement | 1–300 |
| 12:00 | Passenger queue rule v3, color curve | 1–300 |
| 18:15 | Queue fixed at 150 slots, more buses and colors from level 11 | 11–150 |
| 18:28 | Queue set to 152 slots | 11–300 |

Each time, we rebuilt all 300 before playing a few rounds under the new rule. By the end of the day we had a batch of levels with different numbers, and we still didn't know whether they were fun.

## Bot test: 294 of 300

Two days later, at midnight on October 6, we measured the levels for the first time. A simple bot that moves whatever bus is free cleared 294 of 300. The levels left a player almost nothing to think about.

The log from that night:

- 01:00 Added buses with hidden colors and containers.
- 01:15 The new pieces alone never produced a tense moment.
- 03:39 A bot that only looked one move ahead still cleared over 90%.
- 04:03 Switched to generator v5.

After that we added two rows to the lot and rebuilt levels 4–300, then rebuilt all 300 once more at 11:35 p.m. Had we started by measuring with a bot, most of the four rebuilds on October 4 wouldn't have been needed.

![Tapping out the buses that are free to move in Bus Loop Escape](/works/bus-jam/shots/en-1.jpg)

Now we build one full round, the founder plays it, and a bot measures the difficulty before we make levels in bulk. We call this step the vertical slice.

## Nine art swaps

The same October 6 was also heavy on art. Nine commits went in that replaced placeholder art with AI images one piece at a time: booster icons, the main menu, the shop, the loading screen, backgrounds. Close to half of the 9 days' commits, about 145, were art and effects.

Without an art direction set in the first week, each screen got changed on its own. Now we settle art direction and key screens at the design stage and build the vertical slice in that art.

## A release list on day 7

Store account approval and translations were things we could have known on day one. Yet the release to-do list was written on day 7, October 9, and the Japanese and Chinese text and store screenshots went in on October 19, the day the game went live on Google Play.

So the release sheet now comes before the game plan. On day one we write down the countries and languages, store accounts, app name, revenue model and review materials, and send off the slow account applications that day. After the release sheet come the plan, a look at similar games, art and screen design, the vertical slice, and then development.

## If we did it again: Unity

We built Bus Loop Escape with web tech. It got us started fast, but keeping it smooth on budget phones and fitting every screen size kept taking work. That's the decision our founder most wants to change about the first game.

On October 26 we decided to move our games to Unity. New games start in Unity, and Bus Loop Escape is being moved over. The ads, payments, saving and analytics code was split out of the first game, and the next game reuses it as is.

## What we don't know yet

With one game out, we can't use revenue or player numbers to say whether this order was right. We plan to look at the numbers 2, 4 and 8 weeks after launch and decide what to do next. Right now we're preparing the iOS version of Bus Loop Escape and its move to Unity, and the next game started with a release sheet and is going through the vertical slice. When we get something wrong on that one, we'll write it up here with the date.
