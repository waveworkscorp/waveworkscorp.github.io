---
title: "How WaveWorks makes games"
date: "2026-10-31"
category: culture
excerpt: "Our first game, Bus Loop Escape, took 9 days and 313 commits. Here are the order and rules our one-person studio now follows with AI agents."
tags: ["How we work", "AI", "Unity", "Localization"]
cover: ../../../assets/blog/2026-10-31-how-waveworks-makes-games/cover.jpg
coverAlt: "Two small robots on a studio desk stacking blocks into game screens"
works: ["bus-jam"]
---

WaveWorks is a one-person studio founded in October 2025, and AI agents share the code and art work. The founder plans and decides, Claude Code builds and checks, and Codex draws.

Our first game, Bus Loop Escape, took 313 commits over 9 days, from October 3 to 11, 2026, and went live on Google Play on October 19. Looking back at those 9 days, we set the order and the rules we follow from the next game on.

## What the first game taught us

| Item | Record |
|---|---|
| Development | Oct 3 – Oct 11, 2026, 9 days |
| Commits | 313 |
| First pass of rules, level generator and ads | 4 days (Oct 3 – Oct 6) |
| Art and effects commits | About 145 (46%) |
| Day the release to-do list was written | Day 7 (Oct 9) |

The game rules worked within four days, but close to half of the commits went into art and effects. Release prep cost the most time. Store account approval and translations were knowable on day one, yet we didn't list them until day 7.

## A release sheet on day one

Now we write the release sheet before planning the game. On day one we note the regions and languages, store accounts, app name, revenue model and review materials, and we apply for slow account approvals right away.

From there, each stage has a gate to pass before the next one starts.

1. Release sheet: set the release conditions on day one
2. Plan: write who the game is for in one paragraph
3. Analysis: compare similar games and their features
4. Design: settle the art direction and screens in the first week
5. Vertical slice: build one full round in the chosen art, and the founder plays it
6. Build and release: add content, test on real phones, then release
7. Operate: check installs, return visits and revenue at 2, 4 and 8 weeks after launch, then decide what to invest in next

We don't mass-produce levels or art before the vertical slice passes. On the first game we redrew art more than once, and this rule comes from that.

## Build once, use in every game

Ads, payments, saving and analytics aren't rebuilt for each game. We split the code from Bus Loop Escape into shared packages that later games use too. Each game passes its own values, like the app ID, ad units and product IDs, as settings.

Every game also opens the same way: the WaveWorks logo screen, then the game's loading screen, then home. Long-pressing the icon shows "Don't leave" and "Contact us" shortcuts in every game.

On October 26, 2026, we decided to move our games to Unity. We build new games in Unity, and earlier games built with web tech will move over one by one. As the number of games grows, the same tools and structure make fixes easier.

## Ten languages in mind from the start

Every game first ships in five languages: Korean, English, Japanese, and Simplified and Traditional Chinese. After that we add German, French, Spanish, Brazilian Portuguese and Indonesian, for ten in total.

We translate more than the in-game text: we also prepare app names, store descriptions and screenshots for each language. Bus Loop Escape supports the first five languages today.

## No flat screens

We give every game depth. We don't fill the screen with single-color surfaces and plain shapes. 3D games get depth from lighting, shadows and materials, and 2D games from shadows, highlights, thickness and press effects. Buttons and pop-ups are no exception.

Testing happens in three steps: first in the development view, then installed on an emulator, and then played on a real phone. A game doesn't ship until we've checked it on both a high-end and a budget device.

## What's next

We're preparing the iOS version of Bus Loop Escape and its move to Unity. Our other games follow the same order, and we'll post here when they're out. If you play our games and have ideas, send them through the [contact page](/en/contact/).
